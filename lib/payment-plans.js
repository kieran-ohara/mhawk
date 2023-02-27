import debug from "debug";
import format from "date-fns/format";
import { differenceInCalendarMonths } from "date-fns";
import isWithinInterval from "date-fns/isWithinInterval";
import { query } from "./mysql";

import { client, indexName } from "./elasticsearch";

const log = debug("mhawk-payment-plans");

const paymentPlan = (plan) => {
  /* eslint-disable camelcase, no-param-reassign */
  const { refinance_payment_plan_id, start_date, end_date, monthly_price } =
    plan;
  // Payments are stored as negative vaules in the database.
  const payments_sum = -plan.payments_sum;
  plan.payments_sum = payments_sum;
  delete plan.deleted_at;

  const paymentPlanIsFinite = () => end_date !== null;
  if (paymentPlanIsFinite()) {
    const instalments = differenceInCalendarMonths(end_date, start_date) + 1;
    plan.instalments = instalments;

    const totalPrice = (instalments * monthly_price).toFixed(2);
    plan.total_price = totalPrice;
  }
  /* eslint-enable */

  return plan;
};

const getPaymentPlans = async (whereFilterFn, queryInputs = []) => {
  const whereClause = whereFilterFn({
    plansTableName: "plans",
  });

  const constructedQuery = `
SELECT
  plans.id,
  plans.refinance_payment_plan_id,
  plans.reference,
  plans.start_date AS start_date,
  plans.end_date AS end_date,
  plans.created_at,
  plans.updated_at,
  plans.deleted_at,
  plans.monthly_price,
  SUM(payments.amount) AS payments_sum,
  COUNT(payments.id) AS payments_count
FROM payment_plan_payments AS payments
RIGHT JOIN payment_plans AS plans ON payments.payment_plan_id = plans.id
${whereClause}
GROUP BY plans.id
`;

  const result = await query(constructedQuery, queryInputs);
  return result.filter((x) => !x.deleted_at).map(paymentPlan);
};

const getFinitePaymentPlans = async () =>
  getPaymentPlans(
    (params) => `WHERE ${params.plansTableName}.end_date IS NOT NULL`
  );
const getRecurringPaymentPlans = async () =>
  getPaymentPlans(
    (params) => `WHERE ${params.plansTableName}.end_date IS NULL`
  );

const getPaymentPlanByReference = async (reference) => {
  const result = await query(
    "SELECT * FROM payment_plans WHERE reference = ?",
    [reference]
  );
  if (result.length === 0) {
    return null;
  }
  return result[0];
};

const addPaymentPlanPayment = async (reference, opts) => {
  const localPaymentPlan = await getPaymentPlanByReference(reference);
  if (localPaymentPlan === null) {
    return null;
  }
  const result = await query("INSERT IGNORE INTO payment_plan_payments SET ?", {
    payment_plan_id: localPaymentPlan.id,
    ...opts,
  });
  return result.insertId;
};

function dateStringToYMD(isoString) {
  log(isoString);
  const d = new Date(isoString);
  log(d);
  const x = format(d, "yyyy-MM-dd");
  log(x);
  return x;
}

const addPaymentPlans = async (recurringPayments) => {
  log(recurringPayments);
  const result = await query(
    "INSERT INTO payment_plans (monthly_price, start_date, end_date, reference) VALUES ?",
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
    ]
  );
  return result.insertId;
};

const updatePaymentPlan = async (id, updates) => {
  const allowedUpdates = [
    "monthly_price",
    "start_date",
    "end_date",
    "reference",
    "refinance_payment_plan_id",
  ];
  Object.keys(updates).forEach((key) => {
    if (!allowedUpdates.includes(key)) {
      throw Error(`Unexpected key: ${key}`);
    }
  });

  const filteredUpdates = updates;
  if ("start_date" in filteredUpdates) {
    filteredUpdates.start_date = dateStringToYMD(filteredUpdates.start_date);
  }
  if ("end_date" in filteredUpdates) {
    filteredUpdates.end_date = dateStringToYMD(filteredUpdates.end_date);
  }

  const updateList = Object.keys(filteredUpdates)
    .map((key) => `${key}=?`)
    .join(", ");
  const result = await query(
    `UPDATE payment_plans SET ${updateList} WHERE id=${id}`,
    Object.values(filteredUpdates)
  );
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
    "UPDATE payment_plans SET deleted_at = NOW() WHERE id = ?",
    [paymentPlanId]
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
    (params) => {
      return ` WHERE ${params.plansTableName}.id IN (?)`;
    },
    [ids]
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
      query: {
        match: {
          reference: {
            query: term,
          },
        },
      },
    },
  });
  const searchResults = result.body.hits.hits;
  if (searchResults.length === 0) {
    return [];
  }
  const ids = searchResults.map((x) => {
    // eslint-disable-next-line
    return x._source.id;
  });
  const paymentPlans = await getPaymentPlansWithIds(ids);
  return paymentPlans;
};

const getPaymentPlansActiveForPointInTime = async (forDate) => {
  const plans = await getPaymentPlans(() => "");
  return plans.filter((plan) => {
    const settled = plan.is_settled ?? false;
    if (settled) {
      log(`filter out settled payment ${plan.reference}`);
      return false;
    }
    if (plan.end_date === null) {
      log(`allow payment plan with no end date ${plan.reference}`);
      return true;
    }
    const [start, end] = ["start_date", "end_date"].map(
      (x) => new Date(plan[x])
    );
    const allow = isWithinInterval(forDate, { start, end });
    log(`result of allow for ${plan.reference}: ${allow}`);
    return allow;
  });
};

const getAllPaymentPlans = async () => {
  return getPaymentPlans(() => "");
};

export {
  addPaymentPlanPayment,
  addPaymentPlans,
  deletePaymentPlan,
  getAllPaymentPlans,
  getFinitePaymentPlans,
  getPaymentPlanByReference,
  getPaymentPlansActiveForPointInTime,
  getPaymentPlansEndingNextMonth,
  getPaymentPlansWithIds,
  getPaymentPlansWithTag,
  getRecurringPaymentPlans,
  searchPaymentPlansByReference,
  updatePaymentPlan,
};
