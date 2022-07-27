import { useState, useEffect, ChangeEvent, MouseEvent } from "react";

import PaymentMoreMenu from "../components/payment-more-menu";
import { useOutgoing } from "../hooks/outgoings";
import PaymentTags from "../containers/payment-tags";
import {
  default as RefinancePaymentDialog,
  RefinanceOkResult,
} from "../components/refinance-payment-dialog";

export interface PaymentActionsProps {
  outgoingId: number;
  actionsMenuEl: any;
  onDeleteOutgoingClick: (event: MouseEvent) => any;
  onPaymentsModified: () => any | Promise<any>;
}

export default function PaymentActions(props: PaymentActionsProps) {
  const {
    outgoingId,
    actionsMenuEl,
    onDeleteOutgoingClick,
    onPaymentsModified = () => {},
  } = props;
  const [tagsOpen, setTagsOpen] = useState(false);
  const [refinanceOpen, setRefinanceOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    setMenuAnchorEl(actionsMenuEl);
  }, [actionsMenuEl]);

  const {
    outgoing,
    isLoading: outgoingLoading,
    addTag,
    removeTag,
    refinance,
  } = useOutgoing(outgoingId);

  const handleRefinanceClick = () => {
    setMenuAnchorEl(null);
    setRefinanceOpen(true);
  };

  const handlePaymentTagsClick = () => {
    setMenuAnchorEl(null);
    setTagsOpen(true);
  };

  const handlePaymentDeleteClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(null);
    onDeleteOutgoingClick(event);
  };

  const handlePaymentRefinanceOk = async (
    event: MouseEvent<HTMLElement>,
    result: RefinanceOkResult
  ) => {
    setRefinanceOpen(false);
    await refinance(result.refinanceWithId);
    onPaymentsModified();
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
        onRefinanceClick={handleRefinanceClick}
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
      <RefinancePaymentDialog
        onClose={() => setRefinanceOpen(false)}
        onOk={handlePaymentRefinanceOk}
        open={refinanceOpen}
        payment={outgoing}
        paymentLoading={outgoingLoading}
      />
    </>
  );
}
