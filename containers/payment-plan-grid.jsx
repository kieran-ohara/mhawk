import useSWR, { mutate } from 'swr';

import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';

import usePaymentPlans from '../hooks/payment-plans';
import { PaymentPlanGrid } from '../components/payment-plan';

import useTags from '../hooks/tags';
import TagsForm from '../components/tags-form';

export default function PaymentPlanGridContainer(props) {
  const {
    apiQueryParams,
    createMutationFilter = () => false,
    columns,
    showEditButtons,
    isCellEditable,
    onEditCellChangeCommitted,
  } = props;

  const [selectedPaymentPlanName, setSeletctedPaymentPlanName] = useState('');
  const [selectedPaymentPlanId, setSelectedPaymentPlanId] = useState(1);

  const [tagsFormOpen, setTagsFormOpen] = useState(false);

  const {
    paymentPlans,
    isLoading: paymentPlansLoading,
    mutate: paymentPlansMutate,
  } = usePaymentPlans({
    apiQueryParams,
    createMutationFilter,
  });
  const { tags, isLoading: tagsLoading } = useTags();

  const { data: paymentPlanTags, error: paymentPlanTagsErr } = useSWR(
    ['paymentPlanTags', selectedPaymentPlanId],
    async (key, ppId) => {
      const result = await fetch(`/api/v0/payment-plan/${ppId}/tags`);
      return result.json();
    },
  );

  if (paymentPlansLoading || tagsLoading) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }

  const handleTagsClick = (paymentPlan) => {
    const { id, reference } = paymentPlan;
    setSeletctedPaymentPlanName(reference);
    setSelectedPaymentPlanId(id);
    setTagsFormOpen(true);
  };

  const handleCheckboxChanged = async (event) => {
    const { checked, value: tagId } = event.target;
    if (checked) {
      await fetch(
        `/api/v0/payment-plan/${selectedPaymentPlanId}/tags`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tag_id: tagId,
          }),
        },
      );
    } else {
      await fetch(
        `/api/v0/payment-plan/${selectedPaymentPlanId}/tag/${tagId}`,
        { method: 'DELETE' },
      );
    }
    mutate(['paymentPlanTags', selectedPaymentPlanId]);
    paymentPlansMutate();
  };

  return (
    <>
      <PaymentPlanGrid
        data={paymentPlans}
        columns={columns}
        handleTagsClick={handleTagsClick}
        showEditButtons={showEditButtons}
        isCellEditable={isCellEditable}
        onEditCellChangeCommitted={onEditCellChangeCommitted}
      />
      <TagsForm
        open={tagsFormOpen}
        loading={!paymentPlanTagsErr && !paymentPlanTags}
        paymentPlanName={selectedPaymentPlanName}
        paymentPlanTags={paymentPlanTags}
        tags={tags}
        handleCheckboxChanged={handleCheckboxChanged}
        handleClose={() => setTagsFormOpen(false)}
      />
    </>
  );
}
