const Database = require("./../services/database");

const getUserPermissionSet = async (userId) => {
  return new Promise((resolve, reject) => {
    // Try and fetch the user with the provided email
    let databaseInstance = new Database();
    databaseInstance
      .connect()
      .then(() => databaseInstance.getUserDetails(userId))
      .then((userDetails) =>
        Promise.all([
          Promise.resolve(userDetails),
          getUserEndpointPermissions(databaseInstance, userDetails.user_role),
          getUserFieldPermissions(databaseInstance, userDetails.user_role),
        ])
      )
      .then((permissionData) =>
        databaseInstance.closeConnection(permissionData)
      )
      .then((permissionData) => {
        let userData = {
          id: userId,
          first_name: permissionData[0].first_name,
          last_name: permissionData[0].last_name,
          role: permissionData[0].user_role,
        };
        let endpointPermissionsData = permissionData[1];
        let fieldPermissionsData = permissionData[2];

        resolve({
          user: userData,
          endpoints: endpointPermissionsData,
          fields: fieldPermissionsData,
        });
      })
      .catch((err) => {
        console.error(
          "Failed to find user permissions for ID '" + userId + "'. Error: ",
          err
        );

        databaseInstance
          .closeConnection()
          .then(() => {
            console.log(
              "Database connection has been closed successfully after error"
            );
            reject();
          })
          .catch((error) => {
            console.error(
              "Failed to close database connection following error: " + error
            );
            reject();
          });
      });
  });
};

const getUserEndpointPermissions = async (databaseInstance, userRole) => {
  return new Promise((resolve, reject) => {
    databaseInstance
      .getUserPermissionEndpoints(userRole)
      .then((permissionRecords) => {
        let permissionStructure = {};

        permissionRecords.forEach((record) => {
          permissionStructure[record.endpoint] = {
            can_view: record.can_view !== 0,
            can_create: record.can_create !== 0,
            can_edit: record.can_edit !== 0,
            can_delete: record.can_delete !== 0,
          };
        });

        resolve(permissionStructure);
      })
      .catch((err) => reject(err));
  });
};

const getUserFieldPermissions = async (databaseInstance, userRole) => {
  return new Promise((resolve, reject) => {
    databaseInstance
      .getUserPermissionFields(userRole)
      .then((permissionRecords) => {
        let permissionStructure = {};

        permissionRecords.forEach((record) => {
          let fieldStructure = {
            can_view: record.can_view !== 0,
            can_create: record.can_create !== 0,
            can_edit: record.can_edit !== 0,
          };

          if (!permissionStructure.hasOwnProperty(record.endpoint)) {
            permissionStructure[record.endpoint] = {};
          }
          permissionStructure[record.endpoint][record.field_name] =
            fieldStructure;
        });

        resolve(permissionStructure);
      })
      .catch((err) => reject(err));
  });
};

module.exports = {
  getUserPermissionSet,
};
