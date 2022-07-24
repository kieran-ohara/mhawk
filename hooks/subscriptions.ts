import useSWR from "swr";

interface createSubscriptionProps {
  reference: string;
  amount: any;
  startDate: any;
}

interface updateSubscriptionProps {
  amount?: number;
}

const useSubscriptions = () => {
  const getSubscriptionsUrl = "/api/v0/payment-plans?has_end_date=false";
  const { data, error, mutate } = useSWR(getSubscriptionsUrl, async (url) => {
    const response = await fetch(url);
    return response.json();
  });

  const create = async (okData: createSubscriptionProps) => {
    const { reference, amount, startDate } = okData;
    return fetch("/api/v0/payment-plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          reference,
          monthly_price: amount,
          start_date: startDate,
        },
      ]),
    });
  };

  const update = (id: number, data: updateSubscriptionProps) => {
    const { amount } = data;
    return fetch(`/api/v0/payment-plan/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monthly_price: amount,
      }),
    });
  };

  const deleteSubscription = async (id: number) => {
    await fetch(`/api/v0/payment-plan/${id}`, { method: "DELETE" });
    mutate();
  };

  return {
    create,
    update,
    deleteSubscription,
    subscriptions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export { useSubscriptions };
