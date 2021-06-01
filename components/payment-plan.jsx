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

const commonColumns = [
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
];

const crudColumns = [
  {
    field: 'created_at',
    type: 'date',
    hide: true,
    headerName: 'Created At',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.getValue(params.id, 'created_at'))),
  },
  {
    field: 'updated_at',
    type: 'date',
    hide: true,
    headerName: 'Updated At',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.getValue(params.id, 'updated_at'))),
  },
];

function PaymentPlan(props) {
  const { dataURI, columns } = props;
  const concatColumns = commonColumns
    .concat(columns)
    .concat(crudColumns);

  const { data } = useSWR(
    dataURI,
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
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={data}
          columns={concatColumns}
          pageSize={25}
          density="compact"
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </div>
  );
}

export { renderDate, PaymentPlan };
