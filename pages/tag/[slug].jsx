import useSWR from 'swr';
import { PaymentPlan } from '../../components/payment-plan';

const paymentHasEndDate = (params) => params.getValue(params.id, 'end_date') !== null;

const columns = [
  {
    field: 'is_recurring',
    type: 'boolean',
    headerName: 'Is Recurring',
    width: 160,
    valueGetter: (params) => {
      return !paymentHasEndDate(params);
    },
  },
];

export default function RecurringPayments(params) {
  const { slug } = params;

  const { data } = useSWR(
    `/api/v0/payment-plans?tag=${slug}`,
    (req) => fetch(req).then((res) => res.json()),
  );

  return (
    <PaymentPlan
      data={data}
      columns={columns}
    />
  );
}
