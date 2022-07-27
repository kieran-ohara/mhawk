import { useState, useEffect, ChangeEvent, MouseEvent } from "react";

import PaymentMoreMenu from "../components/payment-more-menu";
import { useOutgoing } from "../hooks/outgoings";
import PaymentTags from "../containers/payment-tags";

export interface PaymentActionsProps {
  outgoingId: number;
  actionsMenuEl: any;
  onDeleteOutgoingClick: (event: MouseEvent) => any;
}

export default function PaymentActions(props: PaymentActionsProps) {
  const { outgoingId, actionsMenuEl, onDeleteOutgoingClick } = props;
  const [tagsOpen, setTagsOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    setMenuAnchorEl(actionsMenuEl);
  }, [actionsMenuEl]);

  const {
    outgoing,
    isLoading: outgoingLoading,
    addTag,
    removeTag,
  } = useOutgoing(outgoingId);

  const handlePaymentTagsClick = () => {
    setMenuAnchorEl(null);
    setTagsOpen(true);
  };

  const handlePaymentDeleteClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(null);
    onDeleteOutgoingClick(event);
  };

  const handleTagChecked = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value: tagId } = event.target;
    if (checked) {
      addTag(parseInt(tagId));
    } else {
      removeTag(parseInt(tagId));
    }
  };

  return (
    <>
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
    </>
  );
}
