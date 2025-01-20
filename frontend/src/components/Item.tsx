import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom sytled component for list items.
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "left",
  textTransform: "none",
  color: theme.palette.text.secondary,
}));

export default Item;
