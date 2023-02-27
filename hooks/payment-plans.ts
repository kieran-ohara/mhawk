import useSWR from "swr";
import differenceInMonths from "date-fns/differenceInMonths";

import { paymentPlansFromAPIResponse } from "../lib/payment-plan";

interface createPaymentPlanProps {
  reference: string;
  amount: any;
  startDate: any;
  endDate: any;
}

// eslint-disable-next-line
const usePaymentPlans = () => {
  const getPaymentPlansUrl = "/api/v0/payment-plans?has_end_date=true";
  const { data, error, mutate } = useSWR(getPaymentPlansUrl, async (url) => {
    const response = await fetch(url);
    return paymentPlansFromAPIResponse(await response.json());
  });

  const create = async (okData: createPaymentPlanProps) => {
    return fetch("/api/v0/payment-plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          monthly_price: okData.amount,
          start_date: okData.startDate,
          end_date: okData.endDate,
          reference: okData.reference,
        },
      ]),
    });
  };

  const createWithTotal = async (okData: createPaymentPlanProps) => {
    const { endDate, startDate, amount } = okData;

    const diffMonths = differenceInMonths(endDate, startDate) + 1;
    const totalPriceAsFloat = parseFloat(amount);
    const monthlyPrice = (totalPriceAsFloat / diffMonths).toFixed(2);

    const body = {
      ...okData,
      amount: monthlyPrice,
    };
    return create(body);
  };

  const deletePaymentPlan = async (id: number) => {
    await fetch(`/api/v0/payment-plan/${id}`, { method: "DELETE" });
    mutate();
  };

  return {
    create,
    createWithTotal,
    deletePaymentPlan,
    paymentPlans: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export { usePaymentPlans };

export { PaymentPlan, SettledStatus } from "../lib/payment-plan";
