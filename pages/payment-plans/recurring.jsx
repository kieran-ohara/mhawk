import React from 'react';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

import AppFrame from '../../components/app-frame';
import PaymentPlanGrid from '../../containers/payment-plan-grid';
import FabContainer from '../../components/fab-container';
import CreateRucurringPaymentDialog from '../../components/create-recurring-payment-dialog';

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
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleOk = (okData) => {
    const {
      reference,
      monthlyPrice,
      startDate,
    } = okData;

    fetch('/api/v0/payment-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        reference,
        monthly_price: monthlyPrice,
        start_date: startDate,
      }]),
    });

    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

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
      <AppFrame title="Recurring Payments">
        <PaymentPlanGrid
          apiQueryParams={apiQueryParams}
          columns={columns}
          showEditButtons="true"
          isCellEditable={isCellEditable}
          onEditCellChangeCommitted={onEditCellChangeCommitted}
        />
        <FabContainer>
          <Tooltip title="Add with Total" aria-label="add">
            <Fab color="primary" aria-label="add" onClick={() => { setDialogOpen(true); }}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </FabContainer>
        <CreateRucurringPaymentDialog
          handleOk={handleOk}
          open={dialogOpen}
          handleCancel={handleCancel}
        />
      </AppFrame>
    </>
  );
}
