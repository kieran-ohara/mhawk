import React from 'react';
import differenceInMonths from 'date-fns/differenceInMonths';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

import AppFrame from '../../components/app-frame';
import PaymentPlanGrid from '../../containers/payment-plan-grid';
import FabContainer from '../../components/fab-container';
import CreatePaymentPlanWithTotalDialog from '../../components/create-payment-plan-with-total';

import usePaymentPlans from '../../hooks/payment-plans';
import { renderDate } from '../../components/payment-plan';

const columns = [
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
];

export default function FinitePayments() {
  const {
    createPaymentPlan,
    commitMutations,
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
        <PaymentPlanGrid
          apiQueryParams={{ has_end_date: true }}
          createMutationFilter={(mutation) => ('end_date' in mutation)}
          columns={columns}
          showEditButtons="true"
          initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'is_settled', operatorValue: 'is', value: 'false' }],
              },
            },
          }}
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
