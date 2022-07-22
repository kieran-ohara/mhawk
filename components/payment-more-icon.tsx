import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function PaymentMoreIcon(props) {
  const {onClick} = props;
  return (
    <IconButton
      size="small"
      style={{ marginLeft: 16 }}
      onClick={onClick}
    >
      <MoreVertIcon />
    </IconButton>
  )
}
