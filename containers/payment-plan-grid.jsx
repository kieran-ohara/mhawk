import useSWR, { mutate } from 'swr';

import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import LabelIcon from '@mui/icons-material/Label';
import ListItemText from '@mui/material/ListItemText';
import TagsForm from '../components/tags-form';
import useTags from '../hooks/tags';
import { PaymentPlanGrid } from '../components/payment-plan';
import usePaymentPlans from '../hooks/payment-plans';

export default function PaymentPlanGridContainer(props) {
  const {
    apiQueryParams,
    createMutationFilter = () => false,
    columns,
    showEditButtons,
    isCellEditable,
    onEditCellChangeCommitted,
    initialState = {},
  } = props;

  const [selectedPaymentPlanName, setSeletctedPaymentPlanName] = useState('');
  const [selectedPaymentPlanId, setSelectedPaymentPlanId] = useState(1);

  const [tagsFormOpen, setTagsFormOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMoreClick = (paymentPlan, event) => {
    const { id, reference } = paymentPlan;
    setSeletctedPaymentPlanName(reference);
    setSelectedPaymentPlanId(id);
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleTagsClick = () => {
    setMenuOpen(false);
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
        handleTagsClick={handleMoreClick}
        showEditButtons={showEditButtons}
        isCellEditable={isCellEditable}
        onEditCellChangeCommitted={onEditCellChangeCommitted}
        initialState={initialState}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleTagsClick}>
          <ListItemIcon>
            <LabelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Tags</ListItemText>
        </MenuItem>
      </Menu>
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
