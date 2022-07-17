import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CreatePaymentPlanWithTotalDialog(props) {
  const {
    open, handleOk: handleOkProp, handleCancel, totalLabel,
  } = props;
  const [reference, setReference] = React.useState('');
  const [totalPrice, setTotalPrice] = React.useState('0');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [isShared] = React.useState(false);

  const handleOk = () => {
    handleOkProp({
      reference,
      totalPrice,
      startDate,
      endDate,
      isShared,
    });
  };

  const onDateChanged = (setter) => {
    return (date) => {
      setter(date);
    };
  };

  const onInputChanged = (setter) => {
    return (event) => {
      setter(event.target.value);
    };
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
        <DialogTitle id="confirmation-dialog-title">Create A New Payment</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="normal"
            id="reference"
            label="Reference"
            required
            value={reference}
            onChange={onInputChanged(setReference)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="total"
            label={totalLabel}
            required
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            value={totalPrice}
            onChange={onInputChanged(setTotalPrice)}
          />
          <Grid container>
            <DatePicker
              disableToolbar
              variant="inline"
              margin="normal"
              id="date-picker-inline"
              label="Start Date"
              value={startDate}
              onChange={onDateChanged(setStartDate)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              disableToolbar
              variant="inline"
              margin="normal"
              id="date-picker-inline"
              label="End Date"
              value={endDate}
              onChange={onDateChanged(setEndDate)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
