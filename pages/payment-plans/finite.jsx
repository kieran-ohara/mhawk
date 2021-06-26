import React from 'react';
import differenceInMonths from 'date-fns/differenceInMonths';

import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import CreatePaymentPlanWithTotalDialog from '../../components/create-payment-plan-with-total';
import usePaymentPlans from '../../hooks/payment-plans';
import { PaymentPlan, renderDate } from '../../components/payment-plan';

import FabContainer from '../../components/fab-container';

import AppFrame from '../../components/app-frame';

const columns = [
  {
    field: 'end_date',
    type: 'date',
    headerName: 'End Date',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.getValue(params.id, 'end_date'))),
  },
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
    valueFormatter: (params) => {
      let string = `${params.getValue(params.id, 'payments_count')}`;
      const dateDiff = params.getValue(params.id, 'date_diff_months');
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
      const string = `${params.getValue(params.id, 'payments_sum')}`;
      if (string !== 'null') {
        return `£${string}`;
      }
      return '£0';
    },
  },
  {
    field: 'committed',
    type: 'boolean',
    headerName: 'Committed',
    width: 180,
  },
];

export default function FinitePayments() {
  const {
    createPaymentPlan,
    commitMutations,
    paymentPlans,
  } = usePaymentPlans({
    apiQueryParams: { has_end_date: true },
    createMutationFilter: (mutation) => ('end_date' in mutation),
  });

  const [openDialogWithTotal, setOpenDialogWithTotal] = React.useState(false);
  const handleOkWithTotal = (okData) => {
    const {
      reference,
      totalPrice,
      startDate,
      endDate,
      isShared,
    } = okData;

    const diffMonths = (differenceInMonths(endDate, startDate) + 1);
    const totalPriceAsFloat = parseFloat(totalPrice);
    const monthlyPrice = (totalPriceAsFloat / diffMonths).toFixed(2);

    createPaymentPlan({
      reference,
      monthlyPrice,
      startDate,
      endDate,
      isShared: isShared ? 1 : 0,
    });

    setOpenDialogWithTotal(false);
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOk = (okData) => {
    const {
      reference,
      totalPrice: monthlyPrice,
      startDate,
      endDate,
      isShared,
    } = okData;

    createPaymentPlan({
      reference,
      monthlyPrice,
      startDate,
      endDate,
      isShared: isShared ? 1 : 0,
    });

    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialogWithTotal(false);
    setOpenDialog(false);
  };

  const handleCommit = async () => {
    await commitMutations();
  };

  return (
    <>
      <AppFrame title="Finite Payments">
        <PaymentPlan
          data={paymentPlans}
          columns={columns}
        />
        <FabContainer>
          <Tooltip title="Add with Total" aria-label="add">
            <Fab color="primary" aria-label="add" onClick={() => { setOpenDialogWithTotal(true); }}>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Add" aria-label="add">
            <Fab color="primary" aria-label="add" onClick={() => { setOpenDialog(true); }}>
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Commit Changes" aria-label="add">
            <Fab color="primary" aria-label="add" onClick={handleCommit}>
              <SaveIcon />
            </Fab>
          </Tooltip>
        </FabContainer>
        <CreatePaymentPlanWithTotalDialog
          handleOk={handleOkWithTotal}
          open={openDialogWithTotal}
          handleCancel={handleCancel}
          totalLabel="Total Price"
        />
        <CreatePaymentPlanWithTotalDialog
          handleOk={handleOk}
          open={openDialog}
          handleCancel={handleCancel}
          totalLabel="Monthly Price"
        />
      </AppFrame>
    </>
  );
}
