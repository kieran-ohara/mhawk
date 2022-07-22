import useSWR, { mutate as swrMutate } from 'swr';

// eslint-disable-next-line
export default function useSubscriptions() {
  const getSubscriptionsUrl = '/api/v0/payment-plans?has_end_date=false';
  const { data, error } = useSWR(getSubscriptionsUrl, async (url) => {
    const response = await fetch(url)
    return response.json();
  });

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

  const deleteSubscription = async(id) => {
    await fetch(
      `/api/v0/payment-plan/${id}`,
      { method: 'DELETE' },
    );
    mutate();
  }

  const mutate = () => {
    swrMutate(getSubscriptionsUrl);
  };

  return {
    create,
    deleteSubscription,
    subscriptions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
