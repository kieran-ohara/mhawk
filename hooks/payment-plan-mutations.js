import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';

import { useState } from 'react';

const key = 'paymentPlanMutations';
const initialValue = {
  create: [],
  delete: [],
};

// eslint-disable-next-line
export default function usePaymentPlanMutations() {

  const [getMutations] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return JSON.parse(item) || initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const getActiveMutationsForDate = (date) => {
    const creations = getMutations.create.filter((mutation) => {
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
      delete: getMutations.delete,
    };
  };

  return {
    getMutations,
    getActiveMutationsForDate,
  };
}
