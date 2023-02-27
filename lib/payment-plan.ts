import { differenceInCalendarMonths } from "date-fns";

export enum SettledStatus {
  SETTLED,
  IN_PROGRESS,
  UNDERPAID,
  OVERPAID,
  UNKNOWN,
}

interface PaymentPlanAPIResponse {
  id: number;
  refinance_payment_plan_id?: number;
  reference: string;
  start_date: string;
  end_date?: string;
  monthly_price: number;
  payments_sum: number;
  payments_count: number;
}

export class PaymentPlan {
  private data: PaymentPlanAPIResponse;
  constructor(data: PaymentPlanAPIResponse) {
    this.data = data;
  }

  get settledStatus(): SettledStatus {
    if (this.isSubscription) {
      return SettledStatus.IN_PROGRESS;
    }
    if (this.data.payments_sum > this.totalPrice) {
      return SettledStatus.OVERPAID;
    }
    if (this.sumOutstanding === 0) {
      return SettledStatus.SETTLED;
    }
    if (this.data.refinance_payment_plan_id) {
      return SettledStatus.SETTLED;
    }
    if (this.sumOutstanding <= this.sumRemainingInstalments) {
      return SettledStatus.IN_PROGRESS;
    }
    if (this.sumOutstanding > this.sumRemainingInstalments) {
      return SettledStatus.UNDERPAID;
    }
    return SettledStatus.UNKNOWN;
  }

  get isSubscription(): boolean {
    return (this.data?.end_date ?? null) === null;
  }

  get instalments(): number | null {
    if (this.isSubscription) {
      return null;
    }
    const startDate: Date = new Date(this.data.start_date);
    const endDate: Date = new Date(this.data.end_date);
    return differenceInCalendarMonths(endDate, startDate) + 1;
  }

  get totalPrice(): number | null {
    if (this.isSubscription) {
      return null;
    }
    return parseFloat(this.data.monthly_price * this.instalments).toFixed(2);
  }

  get sumOutstanding(): number | null {
    if (this.isSubscription) {
      return null;
    }
    return this.totalPrice - this.data.payments_sum;
  }

  get sumRemainingInstalments(): number | null {
    if (this.isSubscription) {
      return null;
    }
    return this.remainingInstalments * this.data.monthly_price;
  }

  get remainingInstalments(): number | null {
    if (this.isSubscription) {
      return null;
    }
    const endDate: Date = new Date(this.data.end_date);
    const diff = differenceInCalendarMonths(endDate, Date.now());
    return diff > 0 ? diff : 0;
  }
}

export const paymentPlansFromAPIResponse = (
  apiResponse: PaymentPlanAPIResponse[]
): Promise<ProxyConstructor[]> => {
  const data = apiResponse.map((planv1) => {
    const target = new PaymentPlan(planv1);
    const handler = {
      get(target: any, prop: any) {
        if (planv1.hasOwnProperty(prop)) {
          return planv1[prop];
        }
        // @ts-ignore
        return Reflect.get(...arguments);
      },
    };

    return new Proxy(target, handler);
  });

  return new Promise((resolve) => resolve(data));
};
