
import useSWR from 'swr';

// eslint-disable-next-line
const usePaymentPlans = () => {
  const getPaymentPlansUrl = '/api/v0/payment-plans?has_end_date=true';
  const { data, error, mutate } = useSWR(getPaymentPlansUrl, async (url) => {
    const response = await fetch(url)
    return response.json();
  });

  return {
    paymentPlans: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export { usePaymentPlans };