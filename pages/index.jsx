import useSWR from 'swr';
import { DataGrid } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';

function renderDate(date) {
  if (date !== null) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleString('en-GB', options);
  }
  return '';
}

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'reference', headerName: 'Reference', width: 160 },
  {
    field: 'fullName',
    headerName: 'Payments Made',
    width: 180,
    valueGetter: (params) => {
      let string = `${params.getValue(params.id, 'payments_count')}`;
      const dateDiff = params.getValue(params.id, 'date_diff_months');
      if (dateDiff !== null) {
        string = `${string}/${dateDiff}`;
      }
      return string;
    },
  },
  {
    field: 'monthly_price_calculated',
    headerName: 'Monthly Price',
    width: 180,
    valueGetter: (params) => `£${params.getValue(params.id, 'monthly_price')}`,
  },
  {
    field: 'start_date_calculated',
    headerName: 'Start Date',
    width: 180,
    valueGetter: (params) => renderDate(new Date(params.getValue(params.id, 'start_date'))),
  },
  {
    field: 'end_date_calculated',
    headerName: 'End Date',
    width: 180,
    valueGetter: (params) => renderDate(new Date(params.getValue(params.id, 'end_date'))),
  },
];

export default function Home() {
  const { data } = useSWR(
    '/api/v0/payment-plans',
    (req) => fetch(req).then((res) => res.json()),
  );

  if (!data) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }

  return (
    <div style={{ height: 'calc(100% - 64px)' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid rows={data} columns={columns} pageSize={25} />
        </div>
      </div>
    </div>
  );
}
