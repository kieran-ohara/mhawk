import useSWR from 'swr';

import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import differenceInMonths from 'date-fns/differenceInMonths';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const key = 'paymentPlanMutations';
const initialValue = {
  create: [],
  delete: [],
};

// eslint-disable-next-line
export default function usePaymentPlanMutations(opts = {}) {
  const [mutations, setMutationsProp] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return JSON.parse(item) || initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const {
    createMutationFilter = () => true,
    apiQueryParams = {},
  } = opts;

  const paramsToSearch = new URLSearchParams(apiQueryParams);
  const { data, error } = useSWR(
    `/api/v0/payment-plans?${paramsToSearch.toString()}`,
    (req) => {
      return Promise.all([
        fetch(req),
        mutations,
      ]).then(async (res) => {
        const [fetchResult, localMutations] = res;

        let fetchJson = await fetchResult.json();
        fetchJson = fetchJson.map((entry) => ({ committed: true, ...entry }));

        localMutations.create = localMutations.create.filter(createMutationFilter).map(
          (entry) => ({ committed: false, ...entry }),
        );

        const concat = fetchJson.concat(localMutations.create);
        return concat;
      });
    },
  );

  const getActiveMutationsForDate = (date) => {
    const creations = mutations.create.filter((mutation) => {
      if (isBefore(date, new Date(mutation.start_date))) {
        return false;
      }
      if (mutation.end_date) {
        if (isAfter(date, new Date(mutation.end_date))) {
          return false;
        }
      }
      return true;
    });
    return {
      create: creations,
      delete: mutations.delete,
    };
  };

  const setMutations = (newMutations) => {
    setMutationsProp(newMutations);
    window.localStorage.setItem(key, JSON.stringify(newMutations));
  };

  const createPaymentPlan = (plan) => {
    const {
      reference,
      monthlyPrice,
      startDate,
      isShared,
    } = plan;

    const now = new Date();
    const createMutation = {
      id: uuidv4(),
      reference,
      monthly_price: monthlyPrice,
      start_date: startDate,
      is_shared: isShared,
      created_at: now,
      updated_at: now,
      payments_count: 0,
      payments_sum: 0,
    };
    if (plan.endDate !== null) {
      /* eslint-disable */
      createMutation['end_date'] = plan.endDate;
      createMutation['date_diff_months'] = (differenceInMonths(plan.endDate, startDate) + 1);
      /* eslint-enable */
    }
    const newMutations = mutations;
    newMutations.create.push(createMutation);

    setMutations(newMutations);
  };

  const commitMutations = () => {
    return fetch('/api/v0/payment-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mutations.create.map((m) => {
        // eslint-disable-next-line
        delete m.id;
        return m;
      })),
    }).then(() => {
      setMutations({
        create: [],
        delete: mutations.delete,
      });
    });
  };

  return {
    commitMutations,
    createPaymentPlan,
    getActiveMutationsForDate,
    getMutations: mutations,
    paymentPlans: data,
    isLoading: !error && !data,
    isError: error,
  };
}
