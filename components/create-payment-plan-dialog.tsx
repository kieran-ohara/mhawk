import {useState, MouseEvent} from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export enum AmountType {
  MONTHLY,
  TOTAL,
}

export interface CreatePaymentPlanOkResult {
  reference: string;
  amount: number;
  amountType: AmountType;
  startDate: any;
  endDate: any;
}

export interface CreatePaymentDialogProps {
  open: boolean;
  handleOk: (event: any, result: CreatePaymentPlanOkResult) => void;
  handleCancel: (event: any) => void;
}

export default function CreatePaymentPlanDialog(
  props: CreatePaymentDialogProps
) {
  const { open, handleOk: handleOkProp, handleCancel } = props;

  const [reference, setReference] = useState("");
  const [totalPrice, setTotalPrice] = useState("0");
  const [amountType, setAmountType] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleOk = (event: MouseEvent<HTMLElement>) => {
    let amountTypeToEnum = null;
    switch (amountType) {
      case "monthly":
        amountTypeToEnum = AmountType.MONTHLY;
        break;
      case "total":
        amountTypeToEnum = AmountType.TOTAL;
        break;
    }

    if (amountTypeToEnum === null) {
      throw new Error(`Could not convert amount type "${amountType}" to enum.`);
    }

    handleOkProp(event, {
      reference,
      amount: parseFloat(totalPrice),
      amountType: amountTypeToEnum,
      startDate,
      endDate,
    });
  };

  const handleAmountTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmountType((event.target as HTMLInputElement).value);
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
          Create A New Payment Plan
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
            label={`${amountType} amount`}
            required
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">£</InputAdornment>
              ),
            }}
            value={totalPrice}
            onChange={(event) => setTotalPrice(event.target.value)}
          />

          <FormControl>
            <RadioGroup
              row
              name="radio"
              value={amountType}
              onChange={handleAmountTypeChange}
            >
              <FormControlLabel
                value="monthly"
                control={<Radio />}
                label="Monthly"
              />
              <FormControlLabel
                value="total"
                control={<Radio />}
                label="Total"
              />
            </RadioGroup>
          </FormControl>

          <Grid container>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
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
