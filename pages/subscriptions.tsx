import { useState } from "react";

import AppFrame from "../components/app-frame";

import {
  createPaymentsGridColumns,
  PaymentsGrid,
} from "../components/payments-grid";
import PaymentMoreMenu from "../components/payment-more-menu";
import { useSubscriptions, useSubscription } from "../hooks/subscriptions";
import PaymentMoreIcon from "../components/payment-more-icon";
import PaymentTags from "../containers/payment-tags";

export default function Subscriptions() {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [tagsOpen, setTagsOpen] = useState(false);

  const { subscriptions, isLoading, deleteSubscription } = useSubscriptions();

  const [subscriptionId, setSubscriptionId] = useState(null);
  const {
    subscription,
    isLoading: subscriptionLoading,
    addTag,
    removeTag,
    update: updateSubscription,
  } = useSubscription(subscriptionId);

  const handlePaymentTagsClick = () => {
    setMenuAnchorEl(null);
    setTagsOpen(true);
  };

  const handlePaymentDeleteClick = async () => {
    await deleteSubscription(subscription.id);
    setMenuAnchorEl(null);
  };

  const handlePaymentCellClick = (event) => {
    setSubscriptionId(event.row.id);
  };

  const handleTagChecked = (event) => {
    const { checked, value: tagId } = event.target;
    if (checked) {
      addTag(tagId);
    } else {
      removeTag(tagId);
    }
  };

  const handleIsCellEditable = (params) => {
    return params.colDef.field === "monthly_price";
  };

  const handleProcessRowUpdate = async (after, before) => {
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
      <PaymentMoreIcon onClick={(event) => setMenuAnchorEl(event.target)} />
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
          onCellClick={(event) => setSubscriptionId(event.row.id)}
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
          paymentLoading={subscriptionLoading}
          payment={subscription}
          onTagChecked={handleTagChecked}
          onClose={() => setTagsOpen(false)}
        />
      </AppFrame>
    </>
  );
}
