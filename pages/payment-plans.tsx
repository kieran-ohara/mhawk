import { useState, MouseEvent } from "react";

import { GridValueFormatterParams } from "@mui/x-data-grid";

import AppFrame from "../components/app-frame";
import {
  createPaymentsGridColumns,
  PaymentsGrid,
} from "../components/payments-grid";

import { usePaymentPlans } from "../hooks/payment-plans";
import { PaymentPlan, SettledStatus } from "../lib/payment-plan";
import { renderDate } from "../components/payment-plan";
import PaymentMoreIcon from "../components/payment-more-icon";
import PaymentActions from "../containers/payment-actions";

export default function PaymentPlans() {
  const { paymentPlans, isLoading, deletePaymentPlan, mutate } =
    usePaymentPlans();

  const [selectedPaymentPlanId, setPaymentPlanId] = useState(null);
  const [paymentActionsMenuEl, setPaymentActionsMenuEl] = useState(null);

  const handleDeleteOutgoingClick = async () => {
    await deletePaymentPlan(selectedPaymentPlanId);
    mutate();
  };

  const columns = createPaymentsGridColumns({
    columns: [
      {
        field: "end_date",
        type: "date",
        headerName: "End Date",
        width: 180,
        valueFormatter: (params) => renderDate(new Date(params.value)),
      },
      {
        field: "payments_count",
        type: "number",
        headerName: "Payments Made",
        width: 180,
        valueGetter: (params: any) => {
          return params.row;
        },
        valueFormatter: (params: GridValueFormatterParams<PaymentPlan>) => {
          // @ts-ignore
          let string = `${params.value.payments_count}`;
          const dateDiff = params.value.instalments;
          if (dateDiff !== null) {
            string = `${string}/${dateDiff}`;
          }
          return string;
        },
      },
      {
        field: "payments_sum",
        type: "number",
        headerName: "Total Paid",
        width: 180,
        valueFormatter: (params) => {
          const string = `${params.value}`;
          if (string !== "null") {
            return `£${string}`;
          }
          return "£0";
        },
      },
      {
        field: "settledStatus",
        type: "string",
        headerName: "Settled",
        width: 122,
        valueGetter: (params) => {
          switch (params.value) {
            case SettledStatus.SETTLED: {
              return "Settled";
            }
            case SettledStatus.IN_PROGRESS: {
              return "In Progress";
            }
          }
        },
        hide: true,
      },
    ],
    MoreComponent: (
      <PaymentMoreIcon
        onClick={(event: MouseEvent<HTMLElement>) =>
          setPaymentActionsMenuEl(event.target)
        }
      />
    ),
  });

  return (
    <>
      <AppFrame title="Payment Plans">
        <PaymentsGrid
          data={paymentPlans}
          dataIsLoading={isLoading}
          columns={columns}
          initialState={{
            filter: {
              filterModel: {
                items: [
                  {
                    columnField: "settledStatus",
                    operatorValue: "equals",
                    value: "In Progress",
                  },
                ],
              },
            },
          }}
          isCellEditable={() => false}
          processRowUpdate={() => null}
          onProcessRowUpdateError={() => null}
          onCellClick={(event) => setPaymentPlanId(event.row.id)}
        />
        <PaymentActions
          outgoingId={selectedPaymentPlanId}
          actionsMenuEl={paymentActionsMenuEl}
          onDeleteOutgoingClick={handleDeleteOutgoingClick}
          onPaymentsModified={mutate}
        />
      </AppFrame>
    </>
  );
}
