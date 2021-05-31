import useSWR from 'swr';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';

function renderDate(date) {
  if (date !== null) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleString('en-GB', options);
  }
  return '';
}

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
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={25}
            density="compact"
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </div>
    </div>
  );
}
