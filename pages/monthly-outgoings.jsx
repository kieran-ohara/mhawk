import { PaymentPlan } from '../components/payment-plan';

const columns = [
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
];

export default function Home() {
  const yourDate = new Date();
  const dateString = yourDate.toISOString().split('T')[0];

  return (
    <PaymentPlan
      dataURI={`/api/v0/payment-plans?payments_for_month=${dateString}`}
      columns={columns}
    />
  );
}
