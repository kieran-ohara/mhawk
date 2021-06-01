import debug from 'debug';
import format from 'date-fns/format'
import { query } from './mysql';

const log = debug('mhawk-payment-plans');

const getPaymentPlans = async (whereFilterFn) => {
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

  const result = await query(constructedQuery);
  return result.map((entry) => ({
    total_price: (entry.monthly_price * entry.date_diff_months),
    ...entry,
  }
  ));
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

const addPaymentPlans = async (recurringPayments) => {
  log(recurringPayments);
  const result = await query(
    'INSERT INTO payment_plans (monthly_price, start_date, end_date, reference, is_shared) VALUES ?',
    [
      recurringPayments.map((value) => [
        value.monthly_price,
        value.start_date,
        (value.end_date === null) ? 'NULL' : value.end_date,
        value.reference,
        value.is_shared,
      ]),
    ],
  );
  return result.insertId;
};

const monthDiff = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

const addPaymentPlansUsingTotal = async (opts) => {
  const mapped = opts.map((value) => {
    const {
      end_date: endDate,
      start_date: startDate,
      total_price: totalPrice,
      reference,
      is_shared: isShared,
    } = value;

    const monthsDifference = monthDiff(new Date(startDate), new Date(endDate)) + 1;
    const monthlyPrice = (totalPrice / monthsDifference).toFixed(2);

    log(`Reference: ${reference}, Months difference: ${monthsDifference}, monthly price: ${monthlyPrice}`);

    /* eslint-disable */
    delete opts['total_price'];
    opts['monthly_price'] = monthlyPrice;
    /* eslint-enable */

    return {
      monthly_price: monthlyPrice,
      start_date: startDate,
      end_date: endDate,
      reference,
      is_shared: isShared,
    };
  });

  const result = await addPaymentPlans(mapped);
  return result;
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

export {
  addPaymentPlanPayment,
  addPaymentPlans,
  addPaymentPlansUsingTotal,
  getPaymentPlanByReference,
  getPaymentPlans,
  getPaymentPlansActiveForMonth,
  getPaymentPlansEndingNextMonth,
};
