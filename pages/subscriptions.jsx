import React from 'react';

import AppFrame from '../components/app-frame';
import PaymentPlanGrid from '../containers/payment-plan-grid';

const columns = [
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
];

export default function RecurringPayments() {
  const apiQueryParams = { has_end_date: false };

  const isCellEditable = (params) => {
    return params.colDef.field === 'monthly_price';
  };

  const onEditCellChangeCommitted = (params) => {
    const { id, field, props } = params;
    const data = {};
    data[field] = props.value;

    fetch(`/api/v0/payment-plan/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <>
      <AppFrame title="Subscriptions">
        <PaymentPlanGrid
          apiQueryParams={apiQueryParams}
          columns={columns}
          showEditButtons="true"
          isCellEditable={isCellEditable}
          onEditCellChangeCommitted={onEditCellChangeCommitted}
        />
      </AppFrame>
    </>
  );
}
