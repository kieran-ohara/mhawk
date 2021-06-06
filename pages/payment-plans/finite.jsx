import React from 'react';
import differenceInMonths from 'date-fns/differenceInMonths';
import useSWR from 'swr';
import usePaymentPlanMutations from '../../hooks/payment-plan-mutations';

import { PaymentPlan, renderDate } from '../../components/payment-plan';
import CreatePaymentPlanWithTotalDialog from '../../components/create-payment-plan-with-total';

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
];

export default function FinitePayments() {
  const { data } = useSWR(
    '/api/v0/payment-plans?has_end_date=false',
    (req) => fetch(req).then((res) => res.json()),
  );

  const [open, setOpen] = React.useState(true);
  const { createPaymentPlan } = usePaymentPlanMutations();

  const handleOk = (okData) => {
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

    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <PaymentPlan
        data={data}
        columns={columns}
      />
      <CreatePaymentPlanWithTotalDialog
        handleOk={handleOk}
        open={open}
        handleCancel={handleCancel}
      />
    </>
  );
}
