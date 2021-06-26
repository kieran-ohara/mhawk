import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import CreateRucurringPaymentDialog from '../../components/create-recurring-payment-dialog';
import usePaymentPlans from '../../hooks/payment-plans';
import { PaymentPlan } from '../../components/payment-plan';

import FabContainer from '../../components/fab-container';

import AppFrame from '../../components/app-frame';

const columns = [
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
];

export default function RecurringPayments() {
  const { paymentPlans } = usePaymentPlans({
    apiQueryParams: { has_end_date: false },
    createMutationFilter: () => false,
  });

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

  return (
    <>
      <AppFrame title="Recurring Payments">
        <PaymentPlan
          data={paymentPlans}
          columns={columns}
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
