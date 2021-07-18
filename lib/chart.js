import isWithinInterval from 'date-fns/isWithinInterval';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import format from 'date-fns/format';
import pink from '@material-ui/core/colors/pink';
import { getPaymentPlansActiveForRange } from './payment-plans';

const getChartDataForMonths = async (startDate, endDate) => {
  const plans = await getPaymentPlansActiveForRange(startDate, endDate);
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

export { getChartDataForMonths };
