import LinearProgress from "@mui/material/LinearProgress";
import {
  DataGrid,
  GridToolbar,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { ReactElement } from "React";

function renderDate(date: any) {
  if (date !== null) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-GB", options);
  }
  return "";
}

interface CreatePaymentGridColumnsProps {
  columns: object[];
  MoreComponent?: ReactElement;
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
      valueFormatter: (params: GridValueFormatterParams) => {
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
      valueFormatter: (params: GridValueFormatterParams) =>
        renderDate(new Date(params.value)),
    },
    ...columns,
    {
      field: "created_at",
      type: "date",
      hide: true,
      headerName: "Created At",
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) =>
        renderDate(new Date(params.value)),
    },
    {
      field: "updated_at",
      type: "date",
      hide: true,
      headerName: "Updated At",
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) =>
        renderDate(new Date(params.value)),
    },
  ];

  if (MoreComponent) {
    paymentGridColumns = paymentGridColumns.concat([
      {
        field: "tags",
        headerName: "More",
        width: 120,
        renderCell: () => {
          return MoreComponent;
        },
      },
    ]);
  }

  return paymentGridColumns;
};

const PaymentsGrid = (props: any) => {
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
