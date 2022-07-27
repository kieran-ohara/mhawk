import { useState, MouseEvent } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";

import { useOutgoings } from "../hooks/outgoings";

export interface RefinanceOkResult {
  refinanceWithId: number;
}

export interface RefinancePaymentDialogProps {
  onClose: (event: any) => void;
  onOk: (event: MouseEvent<HTMLElement>, result: RefinanceOkResult) => void;
  open: boolean;
  payment: any;
  paymentLoading: boolean;
}

export default function RefinancePaymentDialog(
  props: RefinancePaymentDialogProps
) {
  const { onClose, onOk, open, payment, paymentLoading } = props;

  const { outgoings, isLoading: outgoingsLoading } = useOutgoings();
  const [refinanceWith, setRefinanceWith] = useState<number>(null);

  const [value, setValue] = useState<any | null>(null);
  const [inputValue, setInputValue] = useState("");

  if (paymentLoading || outgoingsLoading) {
    return <></>;
  }

  const handleOk = (event: MouseEvent<HTMLElement>) => {
    onOk(event, {
      refinanceWithId: parseInt(value.id),
    });
  };

  const outgoingsToOptions = (outgoings: any) => {
    return outgoings.map((outgoing) => ({
      label: outgoing.reference,
      id: outgoing.id,
    }));
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
          Refinance {payment.reference}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={outgoings}
              getOptionLabel={(option: any) => option.reference}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Outgoing" />
              )}
              onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose} color="primary">
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
