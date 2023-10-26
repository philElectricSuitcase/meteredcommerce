import { Resource, EditGuesser, ShowGuesser } from "react-admin";
import { Admin } from "@react-admin/ra-enterprise";
import { dataProvider } from "./services/dataProvider";

import accounts from "./views/accounts";

import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

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
