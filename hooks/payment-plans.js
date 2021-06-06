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
        let fetchJson = await fetchResult.json();
        fetchJson = fetchJson.map((entry) => ({ committed: true, ...entry }));
        const concat = fetchJson.concat(mutations.create.map(
          (entry) => ({ committed: false, ...entry }),
        ));
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
