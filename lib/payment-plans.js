import debug from 'debug';
import format from 'date-fns/format';
import { query } from './mysql';

import { client, indexName } from './elasticsearch';

const log = debug('mhawk-payment-plans');

const getPaymentPlans = async (whereFilterFn, queryInputs = []) => {
  const whereClause = whereFilterFn({
    plansTableName: 'plans',
  });

  const constructedQuery = `
SELECT
  plans.id,
  plans.reference,
  plans.start_date AS start_date,
  plans.end_date AS end_date,
  plans.created_at,
  plans.updated_at,
  plans.deleted_at,
  PERIOD_DIFF(
    EXTRACT(YEAR_MONTH FROM plans.end_date),
    EXTRACT(YEAR_MONTH FROM plans.start_date)
    ) +1 AS date_diff_months,
  plans.monthly_price,
  SUM(payments.amount) AS payments_sum,
  COUNT(payments.id) AS payments_count
FROM payment_plan_payments AS payments
RIGHT JOIN payment_plans AS plans ON payments.payment_plan_id = plans.id
${whereClause}
GROUP BY plans.id
`;

  const result = await query(constructedQuery, queryInputs);
  return result.map((entry) => ({
    total_price: (entry.monthly_price * entry.date_diff_months),
    ...entry,
  })).filter((x) => !x.deleted_at);
};

const getPaymentPlanByReference = async (reference) => {
  const result = await query(
    'SELECT * FROM payment_plans WHERE reference = ?',
    [reference],
  );
  if (result.length === 0) {
    return null;
  }
  return result[0];
};

const addPaymentPlanPayment = async (reference, opts) => {
  const paymentPlan = await getPaymentPlanByReference(reference);
  if (paymentPlan === null) {
    return null;
  }
  const result = await query(
    'INSERT IGNORE INTO payment_plan_payments SET ?',
    {
      payment_plan_id: paymentPlan.id,
      ...opts,
    },
  );
  return result.insertId;
};

function dateStringToYMD(isoString) {
  log(isoString);
  const d = new Date(isoString);
  log(d);
  const x = format(d, 'yyyy-MM-dd');
  log(x);
  return x;
}

const addPaymentPlans = async (recurringPayments) => {
  log(recurringPayments);
  const result = await query(
    'INSERT INTO payment_plans (monthly_price, start_date, end_date, reference) VALUES ?',
    [
      recurringPayments.map((value) => {
        let endDate = null;
        if (value.end_date) {
          endDate = dateStringToYMD(value.end_date);
        }

        return [
          value.monthly_price,
          dateStringToYMD(value.start_date),
          endDate,
          value.reference,
        ];
      }),
    ],
  );
  return result.insertId;
};

const updatePaymentPlan = async (id, updates) => {
  const allowedUpdates = [
    'monthly_price',
    'start_date',
    'end_date',
    'reference',
  ];
  Object.keys(updates).forEach((key) => {
    if (!(allowedUpdates.includes(key))) {
      throw Error(`Unexpected key: ${key}`);
    }
  });

  const filteredUpdates = updates;
  if ('start_date' in filteredUpdates) {
    filteredUpdates.start_date = dateStringToYMD(filteredUpdates.start_date);
  }
  if ('end_date' in filteredUpdates) {
    filteredUpdates.end_date = dateStringToYMD(filteredUpdates.end_date);
  }

  const updateList = Object.keys(filteredUpdates).map((key) => `${key}=?`).join(', ');
  const result = await query(
    `UPDATE payment_plans SET ${updateList} WHERE id=${id}`,
    Object.values(filteredUpdates),
  );
  return result;
};

const monthDiff = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

const getPaymentPlansActiveForMonth = async (date) => {
  const offset = date.getTimezoneOffset();
  const dateWithOffset = new Date(date.getTime() - (offset * 60 * 1000));
  const dateAsString = format(dateWithOffset, 'yyyy-MM-dd');

  const result = await getPaymentPlans((params) => {
    return `
        WHERE (DATE('${dateAsString}') BETWEEN ${params.plansTableName}.start_date AND ${params.plansTableName}.end_date)
        OR (${params.plansTableName}.start_date <= '${dateAsString}' AND ${params.plansTableName}.end_date IS NULL)
        `;
  });

  return result;
};

const getPaymentPlansEndingNextMonth = async () => {
  const result = await query(`
SELECT
  *
FROM payment_plans AS plans
WHERE (plans.end_date BETWEEN DATE(NOW()) AND DATE(DATE_ADD(NOW(), INTERVAL 1 MONTH)));
  `);
  return result;
};

const deletePaymentPlan = async (paymentPlanId) => {
  const result = await query(
    'UPDATE payment_plans SET deleted_at = NOW() WHERE id = ?',
    [paymentPlanId],
  );
  return result;
};

const getPaymentPlansWithTag = async (slug) => {
  return getPaymentPlans((params) => {
    return `
    WHERE ${params.plansTableName}.id IN (
      SELECT jt.payment_plan_id FROM tags INNER JOIN payment_plan_tags AS jt ON jt.tag_id = tags.id WHERE tags.slug = '${slug}'
    )
    `;
  });
};

const getPaymentPlansWithIds = async (ids) => {
  const plans = getPaymentPlans(
    (params) => { return ` WHERE ${params.plansTableName}.id IN (?)`; },
    [ids],
  );
  if (plans.length === 1) {
    return [plans];
  }
  return plans;
};

const searchPaymentPlansByReference = async (term) => {
  const result = await client.search({
    index: indexName,
    body: {
      suggest: {
        ppsuggest: {
          prefix: term,
          completion: {
            field: 'reference',
          },
        },
      },
    },
  });
  const searchResults = result.body.suggest.ppsuggest[0].options;
  if (searchResults.length === 0) {
    return [];
  }
  const ids = searchResults.map((x) => {
    // eslint-disable-next-line
    return x._id;
  });
  const paymentPlans = await getPaymentPlansWithIds(ids);
  return paymentPlans;
};

const mysqlDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const getPaymentPlansActiveForRange = async (startDate, endDate) => {
  const result = await getPaymentPlans((params) => {
    return `
        WHERE (
          ${params.plansTableName}.start_date >= '${mysqlDate(startDate)}' AND
          ${params.plansTableName}.end_date <= '${mysqlDate(endDate)}'
        ) OR (
          ${params.plansTableName}.start_date >= '${mysqlDate(startDate)}' AND
          ${params.plansTableName}.end_date IS NULL
        )
        `;
  });
  return result;
};

export {
  addPaymentPlanPayment,
  addPaymentPlans,
  deletePaymentPlan,
  getPaymentPlanByReference,
  getPaymentPlans,
  getPaymentPlansActiveForMonth,
  getPaymentPlansActiveForRange,
  getPaymentPlansEndingNextMonth,
  getPaymentPlansWithTag,
  searchPaymentPlansByReference,
  updatePaymentPlan,
};
