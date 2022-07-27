import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LabelIcon from "@mui/icons-material/Label";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import DirectionsIcon from "@mui/icons-material/Directions";

export default function PaymentMoreMenu(props) {
  const {
    anchorEl,
    open,
    onClose,
    onTagsClick,
    onDeleteClick,
    onRefinanceClick,
  } = props;
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem onClick={onTagsClick}>
        <ListItemIcon>
          <LabelIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Tags</ListItemText>
      </MenuItem>
      <MenuItem onClick={onRefinanceClick}>
        <ListItemIcon>
          <DirectionsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Refinance</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDeleteClick}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}
