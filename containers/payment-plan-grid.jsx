import useSWR from 'swr';

import LinearProgress from '@material-ui/core/LinearProgress';
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
  } = props;

  const [selectedPaymentPlanName, setSeletctedPaymentPlanName] = useState('');
  const [selectedPaymentPlanId, setSelectedPaymentPlanId] = useState(1);

  const [tagsFormOpen, setTagsFormOpen] = useState(false);

  const { paymentPlans, isLoading: paymentPlansLoading } = usePaymentPlans({
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

  return (
    <>
      <PaymentPlanGrid
        data={paymentPlans}
        columns={columns}
        handleTagsClick={handleTagsClick}
      />
      <TagsForm
        open={tagsFormOpen}
        loading={!paymentPlanTagsErr && !paymentPlanTags}
        paymentPlanName={selectedPaymentPlanName}
        paymentPlanTags={paymentPlanTags}
        tags={tags}
        handleClose={() => setTagsFormOpen(false)}
      />
    </>
  );
}
