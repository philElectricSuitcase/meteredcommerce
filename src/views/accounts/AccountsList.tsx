import { List, TextField, TextInput, Datagrid, EditButton } from "react-admin";
import { EditableDatagrid, RowForm } from "@react-admin/ra-editable-datagrid";

const AccountsList = () => (
  <List>
    <Datagrid>
      <TextField source="Account Name" />
      <TextField source="Account No" />
      <TextField source="Address" />
      <TextField source="Email" />
      <TextField source="Start Date" />
      <TextField source="Active" />
      <EditButton />
    </Datagrid>
  </List>
);

const AccountsListEditable = () => {
  return (
    <>
      <List hasCreate empty={false}>
        <EditableDatagrid
          mutationMode="undoable"
          createForm={<AccountsForm />}
          editForm={<AccountsForm />}
        >
          <TextField source="Account Name" />
          <TextField source="Account No" />
          <TextField source="Address" />
          <TextField source="Email" />
          <TextField source="Start Date" />
          <TextField source="Active" />
        </EditableDatagrid>
      </List>
    </>
  );
};

const AccountsForm = () => (
  <RowForm>
    <TextInput source="Account Name" />
    <TextInput source="Account No" />
    <TextInput source="Address" />
    <TextInput source="Email" />
    <TextInput source="Start Date" />
    <TextInput source="Active" />
  </RowForm>
);

export { AccountsList, AccountsListEditable };
