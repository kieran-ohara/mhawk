import { useRouter } from 'next/router';
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
  const router = useRouter();
  // eslint-disable-next-line
  const { payments_for_month } = router.query;

  let paymentsForMonth = new Date();
  let dateString = paymentsForMonth.toISOString().split('T')[0];
  // eslint-disable-next-line
  if (payments_for_month) {
    try {
      paymentsForMonth = new Date(payments_for_month);
      // eslint-disable-next-line
      dateString = paymentsForMonth.toISOString().split('T')[0];
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <PaymentPlan
      dataURI={`/api/v0/payment-plans?payments_for_month=${dateString}`}
      columns={columns}
    />
  );
}
