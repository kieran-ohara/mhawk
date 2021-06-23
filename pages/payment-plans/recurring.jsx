import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import CreateRucurringPaymentDialog from '../../components/create-recurring-payment-dialog';
import usePaymentPlans from '../../hooks/payment-plan-mutations';
import { PaymentPlan } from '../../components/payment-plan';

import FabContainer from '../../components/fab-container';

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
    createMutationFilter: (mutation) => !('end_date' in mutation),
  });

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleOkWithTotal = () => {
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
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
        handleOk={handleOkWithTotal}
        open={dialogOpen}
        handleCancel={handleCancel}
      />
    </>
  );
}
