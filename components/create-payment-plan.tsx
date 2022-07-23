import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export interface CreatePaymentPlanOkResult {
  reference: string,
  amount: number;
  amountType: string;
  startDate: any
  endDate: any
}

export interface CreatePaymentDialogProps {
  open: boolean,
  handleOk: (event: any, result: CreatePaymentPlanOkResult) => void,
  handleCancel: Function,
}

export default function CreatePaymentPlanDialog(props: CreatePaymentDialogProps) {
  const {
    open, handleOk: handleOkProp, handleCancel,
  } = props;

  const [reference, setReference] = React.useState('');
  const [totalPrice, setTotalPrice] = React.useState('0');
  const [amountType, setAmountType] = React.useState('monthly');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const handleOk = (event) => {
    handleOkProp(event, {
      reference,
      amount: totalPrice,
      amountType,
      startDate,
      endDate,
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

  const handleAmountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountType((event.target as HTMLInputElement).value);
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
        <DialogTitle id="confirmation-dialog-title">Create A New Payment Plan</DialogTitle>
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
            label={`${amountType} amount`}
            required
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            value={totalPrice}
            onChange={onInputChanged(setTotalPrice)}
          />

         <FormControl>
          <RadioGroup
            row
            name="radio"
            value={amountType}
            onChange={handleAmountTypeChange}
          >
            <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
            <FormControlLabel value="total" control={<Radio />} label="Total" />
          </RadioGroup>
        </FormControl>

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
