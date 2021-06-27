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
  const [tagsFormOpen, setTagsFormOpen] = useState(false);

  const { paymentPlans, isLoading: paymentPlansLoading } = usePaymentPlans({
    apiQueryParams,
    createMutationFilter,
  });
  const { tags, isLoading: tagsLoading } = useTags();

  if (paymentPlansLoading || tagsLoading) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }

  const handleTagsClick = (paymentPlan) => {
    const { reference } = paymentPlan;
    setSeletctedPaymentPlanName(reference);
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
        handleClose={() => setTagsFormOpen(false)}
        paymentPlanName={selectedPaymentPlanName}
        tags={tags}
      />
    </>
  );
}
