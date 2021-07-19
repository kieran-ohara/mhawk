import isWithinInterval from 'date-fns/isWithinInterval';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import pink from '@material-ui/core/colors/pink';
import { getPaymentPlansActiveFromDate } from './payment-plans';
import { getTaxedWage } from './user';

const getChartDataForMonths = async (startDate, endDate) => {
  const plans = await getPaymentPlansActiveFromDate(startDate);
  const months = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  });

  const data = months.map((month) => {
    const result = {
      name: format(month, 'LLL y'),
    };

    plans.forEach((plan) => {
      if (plan.end_date === null) {
        result[plan.reference] = plan.monthly_price;
        return;
      }
      const [start, end] = ['start_date', 'end_date'].map((x) => new Date(plan[x]));
      const inMonth = isWithinInterval(month, { start, end });
      result[plan.reference] = inMonth ? plan.monthly_price : 0;
    });

    return result;
  });

  return {
    meta: {
      keys: plans.map((p) => ({
        reference: p.reference,
        colour: (p.end_date) ? pink[500] : pink[300],
      })),
    },
    data,
  };
};

const aggregateSum = (plans, filter) => {
  return plans.filter(filter).reduce((acc, plan) => acc + plan.monthly_price, 0);
};

const getChartDataForMonthsAggregateEndDate = async (startDate, endDate) => {
  const plans = await getPaymentPlansActiveFromDate(startDate);
  const recurringPlans = plans.filter((plan) => plan.end_date === null);
  const finitePlans = plans.filter((plan) => plan.end_date !== null);

  const months = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  });

  const wage = await getTaxedWage(1);

  const data = months.map((month) => {
    const sumRecurring = aggregateSum(recurringPlans, () => true);
    const sumFinite = aggregateSum(finitePlans, (plan) => {
      const [start, end] = ['start_date', 'end_date'].map((x) => new Date(plan[x]));
      return isWithinInterval(month, { start, end });
    });
    return {
      name: format(month, 'LLL y'),
      Recurring: sumRecurring,
      Finite: sumFinite,
      Remaining: (wage - sumRecurring - sumFinite),
      date: formatISO(month),
    };
  });

  return {
    meta: {
      keys: [
        {
          reference: 'Recurring',
          colour: pink[500],
        },
        {
          reference: 'Finite',
          colour: pink[300],
        },
        {
          reference: 'Remaining',
          colour: pink[100],
        },
      ],
    },
    data,
  };
};

export { getChartDataForMonths, getChartDataForMonthsAggregateEndDate };
