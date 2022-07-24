import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function renderDate(date) {
  if (date !== null) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-GB", options);
  }
  return "";
}

interface CreatePaymentGridColumnsProps {
  columns: object[];
  moreComponent?: Function;
}

const createPaymentsGridColumns = (props: CreatePaymentGridColumnsProps) => {
  const { columns, MoreComponent } = props;

  let paymentGridColumns = [
    {
      field: "id",
      type: "number",
      hide: true,
      headerName: "ID",
      width: 90,
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 160,
    },
    {
      field: "monthly_price",
      type: "number",
      headerName: "Monthly Price",
      width: 165,
      valueFormatter: (params) => {
        return `£${params.value}`;
      },
      editable: true,
    },
    {
      field: "start_date",
      type: "date",
      hide: true,
      headerName: "Start Date",
      width: 180,
      valueFormatter: (params) => renderDate(new Date(params.value)),
    },
    ...columns,
    {
      field: "created_at",
      type: "date",
      hide: true,
      headerName: "Created At",
      width: 180,
      valueFormatter: (params) => renderDate(new Date(params.value)),
    },
    {
      field: "updated_at",
      type: "date",
      hide: true,
      headerName: "Updated At",
      width: 180,
      valueFormatter: (params) => renderDate(new Date(params.value)),
    },
  ];

  if (MoreComponent) {
    paymentGridColumns = paymentGridColumns.concat([
      {
        field: "tags",
        headerName: "More",
        width: 120,
        renderCell: (gridParams) => {
          return MoreComponent;
        },
      },
    ]);
  }

  return paymentGridColumns;
};

const PaymentsGrid = (props) => {
  const {
    data,
    dataIsLoading,
    columns,
    isCellEditable,
    processRowUpdate,
    onProcessRowUpdateError,
    onCellClick = () => {},
    initialState = {},
  } = props;

  if (dataIsLoading) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={data}
            columns={columns}
            density="compact"
            components={{
              Toolbar: GridToolbar,
            }}
            isCellEditable={isCellEditable}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={onProcessRowUpdateError}
            initialState={initialState}
            pageSize={100}
            onCellClick={onCellClick}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
      </div>
    </>
  );
};

export { createPaymentsGridColumns, PaymentsGrid };
