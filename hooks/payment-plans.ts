
import useSWR from 'swr';

interface createPaymentPlanProps {
  reference: string,
  amount: any,
  startDate: any,
  endDate: any
}

// eslint-disable-next-line
const usePaymentPlans = () => {
  const getPaymentPlansUrl = '/api/v0/payment-plans?has_end_date=true';
  const { data, error, mutate } = useSWR(getPaymentPlansUrl, async (url) => {
    const response = await fetch(url)
    return response.json();
  });

  const create = async(okData: createPaymentPlanProps) => {
    return fetch('/api/v0/payment-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        monthly_price: okData.amount,
        start_date: okData.startDate,
        end_date: okData.endDate,
        reference: okData.reference,
      }]),
    });
  }

  return {
    create,
    paymentPlans: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export { usePaymentPlans };
