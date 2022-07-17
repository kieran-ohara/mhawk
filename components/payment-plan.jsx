import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
    valueFormatter: (params) => {
      return `£${params.value}`;
    },
    editable: true,
  },
  {
    field: 'start_date',
    type: 'date',
    hide: true,
    headerName: 'Start Date',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.value)),
  },
];

const crudColumns = [
  {
    field: 'created_at',
    type: 'date',
    hide: true,
    headerName: 'Created At',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.value)),
  },
  {
    field: 'updated_at',
    type: 'date',
    hide: true,
    headerName: 'Updated At',
    width: 180,
    valueFormatter: (params) => renderDate(new Date(params.value)),
  },
];

const editColumns = (props) => [
  {
    field: 'tags',
    headerName: 'Actions',
    width: 120,
    renderCell: (gridParams) => {
      const paymentPlan = {
        /* eslint-disable */
        id: gridParams.row.id,
        reference: gridParams.row.reference,
        /* eslint-disable */
      };
      return (
        <IconButton
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={(event) => props.handleTagsClick(paymentPlan, event)}
        >
          <MoreVertIcon />
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
    isCellEditable = () => false,
    onEditCellChangeCommitted = () => null,
    initialState = {}
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
          isCellEditable={isCellEditable}
          onEditCellChangeCommitted={onEditCellChangeCommitted}
          initialState={initialState}
          pageSize={100}
        />
      </div>
    </div>
  );
}

export { renderDate, PaymentPlanGrid };
