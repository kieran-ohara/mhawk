import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Checkbox from '@mui/material/Checkbox';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';

import useTags from '../hooks/tags';

export default function TagsForm(props) {
  const {
    open,
    paymentLoading,
    payment,
    onTagChecked,
    onClose,
  } = props;

  const { tags, isLoading: tagsLoading } = useTags();

  if (paymentLoading || tagsLoading) {
    return <></>
  }

  const checkboxes = () => {
    return (
      <>
        {tags.map((value) => {
          let extraProps = {};
          payment.tags.forEach((ppTag) => {
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
                  onChange={(event) => onTagChecked(event)}
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
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">Tags</DialogTitle>
        <DialogContent dividers>
          <FormControl component="fieldset">
            <FormLabel component="legend">{`Select tags for ${payment.reference}`}</FormLabel>
            <FormGroup>
              {checkboxes()}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
