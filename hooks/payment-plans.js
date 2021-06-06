import useSWR from 'swr';
import usePaymentPlanMutations from './payment-plan-mutations';

export default function usePaymentPlans(params) {
  const paramsToSearch = new URLSearchParams(params);

  const { getMutations } = usePaymentPlanMutations();
  const { data, error } = useSWR(
    `/api/v0/payment-plans?${paramsToSearch.toString()}`,
    (req) => {
      return Promise.all([
        fetch(req),
        getMutations,
      ]).then(async (res) => {
        const [fetchResult, mutations] = res;
        const fetchJson = await fetchResult.json();
        const concat = fetchJson.concat(mutations.create);
        return concat;
      });
    },
  );

  return {
    paymentPlans: data,
    isLoading: !error && !data,
    isError: error,
  };
}
