import AccountsIcon from "@mui/icons-material/AccountBox";
import { AccountsList, AccountsListEditable } from "./AccountsList";

export default {
  icon: AccountsIcon,
  options: {
    label: "Accounts",
  },
  list: AccountsListEditable,
  recordRepresentation: "name",
};
