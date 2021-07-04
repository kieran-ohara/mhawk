import {
  DataGrid,
  GridToolbar,
} from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import IconButton from '@material-ui/core/IconButton';
import LabelIcon from '@material-ui/icons/Label';

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

const editColumns = (props) => [
  {
    field: 'tags',
    headerName: 'Tags',
    width: 120,
    renderCell: (gridParams) => {
      const paymentPlan = {
        /* eslint-disable */
        id: gridParams.getValue(gridParams.id, 'id'),
        reference: gridParams.getValue(gridParams.id, 'reference'),
        /* eslint-disable */
      };
      return (
        <IconButton
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={(event) => props.handleTagsClick(paymentPlan, event)}
        >
          <LabelIcon />
        </IconButton>
      );
    },
  },
];

function PaymentPlanGrid(props) {
  const {
    columns,
    data,
    handleTagsClick = () => {},
    showEditButtons = false,
  } = props;

  let concatColumns = commonColumns
    .concat(columns)
    .concat(crudColumns);

  if (showEditButtons) {
    concatColumns = concatColumns.concat(editColumns({
      handleTagsClick,
    }));
  }

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

export { renderDate, PaymentPlanGrid };
