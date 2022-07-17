import useSWR, { mutate as swrMutate } from 'swr';

// eslint-disable-next-line
export default function useSubscriptions() {
  const getSubscriptionsUrl = '/api/v0/payment-plans?has_end_date=false';
  const { data, error } = useSWR(getSubscriptionsUrl, (url) => fetch(url));

  const create = async (okData) => {
    const {
      reference,
      monthlyPrice,
      startDate,
    } = okData;
    return fetch('/api/v0/payment-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        reference,
        monthly_price: monthlyPrice,
        start_date: startDate,
      }]),
    });
  };

  const mutate = () => {
    swrMutate(getSubscriptionsUrl);
  };

  return {
    create,
    subscriptions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
