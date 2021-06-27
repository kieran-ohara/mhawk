import { useRouter } from 'next/router';
import AppFrame from '../../components/app-frame';
import PaymentPlanGrid from '../../containers/payment-plan-grid';

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

export default function TaggedPaymentPlans() {
  const router = useRouter();
  const { slug } = router.query;

  const apiQueryParams = {
    tag: slug,
  };

  return (
    <AppFrame title={slug}>
      <PaymentPlanGrid
        apiQueryParams={apiQueryParams}
        columns={columns}
      />
    </AppFrame>
  );
}
