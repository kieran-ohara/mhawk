import React from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default function CreatePaymentPlanWithTotalDialog(props) {
  const { open, handleOk: handleOkProp, handleCancel } = props;
  const [reference, setReference] = React.useState('');
  const [totalPrice, setTotalPrice] = React.useState('0');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [isShared, setIsShared] = React.useState(false);

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

  const handleIsSharedChanged = (event) => {
    setIsShared(event.target.checked);
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
            label="Total Amount"
            required
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            value={totalPrice}
            onChange={onInputChanged(setTotalPrice)}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container>
              <KeyboardDatePicker
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
              />
              <KeyboardDatePicker
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
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isShared}
                onChange={handleIsSharedChanged}
                name="checkedB"
                color="primary"
              />
        )}
            label="Is Shared"
          />
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
