import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Checkbox from '@material-ui/core/Checkbox';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';

export default function TagsForm(props) {
  const {
    open,
    loading,
    paymentPlanName,
    paymentPlanTags,
    tags,
    handleCheckboxChanged,
    handleClose,
  } = props;

  const checkboxes = () => {
    return (
      <>
        {tags.map((value) => {
          let extraProps = {};
          paymentPlanTags.forEach((ppTag) => {
            if (ppTag.id === value.id) {
              extraProps = { defaultChecked: true };
            }
          });
          return (
            <FormControlLabel
              key={value.slug}
              control={(
                <Checkbox
                  name={value.name}
                  value={value.id}
                  onChange={(event) => handleCheckboxChanged(event)}
                  {...extraProps}
                />
              )}
              label={value.name}
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">Tags</DialogTitle>
        <DialogContent dividers>
          { (loading) ? (
            <></>
          ) : (
            <FormControl component="fieldset">
              <FormLabel component="legend">{`Select tags for ${paymentPlanName}`}</FormLabel>
              <FormGroup>
                {checkboxes(paymentPlanTags, tags)}
              </FormGroup>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
