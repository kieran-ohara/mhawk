import { PaymentPlan, renderDate } from '../../components/payment-plan';

const columns = [
  {
    field: 'id',
    type: 'number',
    hide: true,
    headerName: 'ID',
    width: 90,
  },
  { field: 'reference', headerName: 'Reference', width: 160 },
  {
    field: 'monthly_price',
    type: 'number',
    headerName: 'Monthly Price',
    width: 165,
    valueFormatter: (params) => `£${params.getValue(params.id, 'monthly_price')}`,
  },
  {
    field: 'start_date',
    type: 'date',
    hide: true,
    headerName: 'Start Date',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.getValue(params.id, 'start_date'))),
  },
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
];

export default function Home() {
  return (
    <PaymentPlan
      dataURI="/api/v0/payment-plans?has_end_date=false"
      columns={columns}
    />
  );
}
