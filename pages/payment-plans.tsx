import { useState } from 'react';

import AppFrame from '../components/app-frame';
import { createPaymentsGridColumns, PaymentsGrid } from '../components/payments-grid';

import { usePaymentPlans } from '../hooks/payment-plans';
import { renderDate } from '../components/payment-plan';

export default function PaymentPlans() {
  const { paymentPlans, isLoading } = usePaymentPlans();

  const [subscriptionId, setSubscriptionId] = useState(null);

  const columns = createPaymentsGridColumns({
    columns: [
      {
        field: 'end_date',
        type: 'date',
        headerName: 'End Date',
        width: 180,
        valueFormatter: (params) => renderDate(new Date(params.value)),
      },
      {
        field: 'payments_count',
        type: 'number',
        headerName: 'Payments Made',
        width: 180,
        valueFormatter: (params) => {
          let string = `${params.value}`;
          const dateDiff = params.value;
          if (dateDiff !== null) {
            string = `${string}/${dateDiff}`;
          }
          return string;
        },
      },
      {
        field: 'payments_sum',
        type: 'number',
        headerName: 'Total Paid',
        width: 180,
        valueFormatter: (params) => {
          const string = `${params.value}`;
          if (string !== 'null') {
            return `£${string}`;
          }
          return '£0';
        },
      },
      {
        field: 'is_settled',
        type: 'boolean',
        headerName: 'Settled',
        width: 122,
        hide: true,
      },
    ]
  });

  return (
    <>
      <AppFrame title="Payment Plans">
        <PaymentsGrid
          data={paymentPlans}
          dataIsLoading={isLoading}
          columns={columns}
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'is_settled', operatorValue: 'is', value: 'false' }],
              },
            },
          }}
          isCellEditable={() => false}
          processRowUpdate={() => null}
          onProcessRowUpdateError={() => null}
          onCellClick={event => setSubscriptionId(event.row.id)}
        />
      </AppFrame>
    </>
  );
}
