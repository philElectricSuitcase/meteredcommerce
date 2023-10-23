import { Admin, Resource, EditGuesser, ShowGuesser } from "react-admin";
//import { Admin } from "@react-admin/ra-enterprise";
import { dataProvider } from "./services/dataProvider";
//import { authProvider } from "./services/authProvider";

import accounts from "./view/accounts";

export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="accounts"
      {...accounts}
      edit={EditGuesser}
      show={ShowGuesser}
    />
  </Admin>
);
