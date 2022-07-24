import { useState, ChangeEvent, MouseEvent } from "react";

import AppFrame from "../components/app-frame";

import {
  createPaymentsGridColumns,
  PaymentsGrid,
} from "../components/payments-grid";
import PaymentMoreMenu from "../components/payment-more-menu";
import { useSubscriptions } from "../hooks/subscriptions";
import { useOutgoing } from "../hooks/outgoings";
import PaymentMoreIcon from "../components/payment-more-icon";
import PaymentTags from "../containers/payment-tags";
import { GridCellParams } from "@mui/x-data-grid";

export default function Subscriptions() {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [tagsOpen, setTagsOpen] = useState(false);

  const { subscriptions, isLoading, deleteSubscription } = useSubscriptions();

  const [subscriptionId, setSubscriptionId] = useState(null);
  const {
    outgoing,
    isLoading: outgoingLoading,
    addTag,
    removeTag,
    update: updateSubscription,
  } = useOutgoing(subscriptionId);

  const handlePaymentTagsClick = () => {
    setMenuAnchorEl(null);
    setTagsOpen(true);
  };

  const handlePaymentDeleteClick = async () => {
    await deleteSubscription(outgoing.id);
    setMenuAnchorEl(null);
  };

  const handleTagChecked = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value: tagId } = event.target;
    if (checked) {
      addTag(parseInt(tagId));
    } else {
      removeTag(parseInt(tagId));
    }
  };

  const handleIsCellEditable = (params: GridCellParams) => {
    return params.colDef.field === "monthly_price";
  };

  const handleProcessRowUpdate = async (after: any) => {
    const { monthly_price } = after;
    await updateSubscription({
      monthly_price,
    });
    return after;
  };

  const handleProcessRowUpdateError = async () => {};

  const columns = createPaymentsGridColumns({
    columns: [
      {
        field: "payments_count",
        type: "number",
        headerName: "Payments Made",
        width: 180,
      },
    ],
    MoreComponent: (
      <PaymentMoreIcon
        onClick={(event: MouseEvent<HTMLElement>) =>
          setMenuAnchorEl(event.target)
        }
      />
    ),
  });

  return (
    <>
      <AppFrame title="Subscriptions">
        <PaymentsGrid
          data={subscriptions}
          dataIsLoading={isLoading}
          columns={columns}
          isCellEditable={handleIsCellEditable}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onCellClick={(event: GridCellParams) =>
            setSubscriptionId(event.row.id)
          }
        />
        <PaymentMoreMenu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => {
            setMenuAnchorEl(null);
          }}
          onTagsClick={handlePaymentTagsClick}
          onDeleteClick={handlePaymentDeleteClick}
        />
        <PaymentTags
          open={tagsOpen}
          paymentLoading={outgoingLoading}
          payment={outgoing}
          onTagChecked={handleTagChecked}
          onClose={() => setTagsOpen(false)}
        />
      </AppFrame>
    </>
  );
}
