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

function PaymentPlan(props) {
  const { dataURI, columns } = props;

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

export { renderDate, PaymentPlan };
