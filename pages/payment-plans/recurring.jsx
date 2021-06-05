import useSWR from 'swr';
import { PaymentPlan } from '../../components/payment-plan';

const columns = [
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
];

export default function RecurringPayments() {
  const { data } = useSWR(
    '/api/v0/payment-plans?has_end_date=false',
    (req) => fetch(req).then((res) => res.json()),
  );

  return (
    <PaymentPlan
      data={data}
      columns={columns}
    />
  );
}
