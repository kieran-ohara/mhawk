import { PaymentPlan, SettledStatus } from "../../lib/payment-plan";

describe("settledStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-02-01T00:00:00.000Z"));
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("subscriptions always report IN_PROGRESS", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.settledStatus).toBe(SettledStatus.IN_PROGRESS);
  });
  it("reports IN_PROGRESS when outstanding amount can be paid off in plan's remaining month count", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "2023-01-01T00:00:00.000Z",
      end_date: "2023-06-01T00:00:00.000Z",
      monthly_price: 10,
      payments_sum: 20,
      payments_count: 2,
    });
    expect(plan.settledStatus).toBe(SettledStatus.IN_PROGRESS);
  });
  it("reports SETTLED when the payment plan has been refinanced", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "2023-01-01T00:00:00.000Z",
      end_date: "2023-06-01T00:00:00.000Z",
      monthly_price: 10,
      payments_sum: 20,
      payments_count: 2,
      refinance_payment_plan_id: 2,
    });
    expect(plan.settledStatus).toBe(SettledStatus.SETTLED);
  });
  it("reports OVERPAID when the total payment is greater than total cost  ", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "2023-01-01T00:00:00.000Z",
      end_date: "2023-06-01T00:00:00.000Z",
      monthly_price: 10,
      payments_sum: 61,
      payments_count: 2,
    });
    expect(plan.settledStatus).toBe(SettledStatus.OVERPAID);
  });
  it("reports UNDERPAID when outstanding amount cannot be paid of in plan's remaining month count", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "2023-01-01T00:00:00.000Z",
      end_date: "2023-06-01T00:00:00.000Z",
      monthly_price: 10,
      payments_sum: 10,
      payments_count: 1,
    });
    expect(plan.settledStatus).toBe(SettledStatus.UNDERPAID);
  });
});

describe("instalments", () => {
  it("returns null if this is a subscription", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.instalments).toBe(null);
  });
  it("returns difference in number of months between start/end date", () => {
    [
      {
        start_date: "2021-04-30T23:00:00.000Z",
        end_date: "2021-06-30T23:00:00.000Z",
        expected: 3,
      },
      {
        start_date: "2021-04-30T23:00:00.000Z",
        end_date: "2021-09-30T23:00:00.000Z",
        expected: 6,
      },
      {
        start_date: "2021-01-30T23:00:00.000Z",
        end_date: "2021-10-30T23:00:00.000Z",
        expected: 10,
      },
    ].forEach(({ start_date, end_date, expected }) => {
      const plan = new PaymentPlan({
        id: 0,
        reference: "",
        start_date,
        end_date,
        monthly_price: 0,
        payments_sum: 0,
        payments_count: 0,
      });
      expect(plan.instalments).toBe(expected);
    });
  });
});

describe("totalPrice", () => {
  it("returns null if this is a subscription", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.totalPrice).toBe(null);
  });
  it("returns monthly cost multiplied by counts of instalments", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "2021-04-30T23:00:00.000Z",
      end_date: "2021-09-30T23:00:00.000Z",
      monthly_price: 100,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.totalPrice).toBe(600);
  });
});

describe("isSubscription", () => {
  it("is true when there is no end date", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.isSubscription).toBe(true);
  });
  it("is true when the end date is null", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      end_date: null,
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.isSubscription).toBe(true);
  });
  it("is false when there is an end date", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      end_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.isSubscription).toBe(false);
  });
});

describe("sumOutstanding", () => {
  it("returns null if this is a subscription", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.sumOutstanding).toBe(null);
  });
  it("returns the outstanding amount of money needed to finish payment plan", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "2021-01-30T23:00:00.000Z",
      end_date: "2021-10-30T23:00:00.000Z",
      monthly_price: 10,
      payments_sum: 20,
      payments_count: 2,
    });
    expect(plan.sumOutstanding).toBe(80);
  });
});

describe("remainingInstalments", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-01T00:00:00.000Z"));
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("returns null if this is a subscription", () => {
    const plan = new PaymentPlan({
      id: 0,
      reference: "",
      start_date: "",
      monthly_price: 0,
      payments_sum: 0,
      payments_count: 0,
    });
    expect(plan.remainingInstalments).toBe(null);
  });
  it("returns remaining amount of instalments between now and end_date", () => {
    [
      {
        end_date: "2023-06-01T00:00:00.000Z",
        expected: 5,
      },
    ].forEach(({ end_date, expected }) => {
      const plan = new PaymentPlan({
        id: 0,
        reference: "",
        start_date: "2021-01-30T23:00:00.000Z",
        end_date,
        monthly_price: 0,
        payments_sum: 0,
        payments_count: 0,
      });
      expect(plan.remainingInstalments).toBe(expected);
    });
  });
});
