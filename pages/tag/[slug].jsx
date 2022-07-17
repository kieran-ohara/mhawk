import { useRouter } from 'next/router';
import AppFrame from '../../components/app-frame';
import PaymentPlanGrid from '../../containers/payment-plan-grid';

const paymentHasEndDate = (params) => params.value !== null;

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
  {
    field: 'is_settled',
    type: 'boolean',
    headerName: 'Settled',
    width: 122,
    hide: true,
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
        initialState={{
          filter: {
            filterModel: {
              items: [{ columnField: 'is_settled', operatorValue: 'is', value: 'false' }],
            },
          },
        }}
      />
    </AppFrame>
  );
}
