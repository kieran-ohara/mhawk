import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const key = 'paymentPlanMutations';
const initialValue = {
  create: [],
  delete: [],
};

// eslint-disable-next-line
export default function usePaymentPlanMutations() {

  const [mutations, setMutationsProp] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return JSON.parse(item) || initialValue;
    } catch (error) {
      return initialValue;
    }
  });

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

    const createMutation = {
      id: uuidv4(),
      reference,
      monthly_price: monthlyPrice,
      start_date: startDate,
      is_shared: isShared,
    };
    if (plan.endDate !== null) {
      // eslint-disable-next-line
      createMutation['end_date'] = plan.endDate;
    }
    const concatCreateMutations = mutations.create.concat(createMutation);
    const newMutations = mutations;
    newMutations.create = concatCreateMutations;

    setMutations(newMutations);
  };

  return {
    createPaymentPlan,
    getActiveMutationsForDate,
  };
}
