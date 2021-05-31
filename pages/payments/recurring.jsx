import { PaymentPlan } from '../../components/payment-plan';

const columns = [
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
];

export default function Home() {
  return (
    <PaymentPlan
      dataURI="/api/v0/payment-plans?has_end_date=false"
      columns={columns}
    />
  );
}
