import useSWR from 'swr';
import { PaymentPlan, renderDate } from '../../components/payment-plan';

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

  return (
    <PaymentPlan
      data={data}
      columns={columns}
    />
  );
}
