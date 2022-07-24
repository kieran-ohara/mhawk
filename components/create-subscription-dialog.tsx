import {useState, MouseEvent} from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export interface CreateSubscriptionOkResult {
  reference: string;
  amount: number;
  startDate: any;
}

export interface CreateSubscriptionDialogProps {
  open: boolean;
  handleOk: (event: MouseEvent<HTMLElement>, result: CreateSubscriptionOkResult) => void;
  handleCancel: (event: any) => void;
}

export default function CreatePaymentPlanWithTotalDialog(props: CreateSubscriptionDialogProps) {
  const { open, handleOk: handleOkProp, handleCancel } = props;
  const [reference, setReference] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("0");
  const [startDate, setStartDate] = useState(new Date());

  const handleOk = (event: MouseEvent<HTMLElement>) => {
    handleOkProp(event, {
      reference,
      amount: parseFloat(monthlyPrice),
      startDate,
    });
  };

  return (
    <>
      <Dialog
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">
          Create A New Subscription
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="normal"
            id="reference"
            label="Reference"
            required
            value={reference}
            onChange={(event) => setReference(event.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="total"
            label="amount"
            required
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">£</InputAdornment>
              ),
            }}
            value={monthlyPrice}
            onChange={(event) => setMonthlyPrice(event.target.value)}
          />
          <Grid container>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
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
