const cryptoUtils = require("./../utils/cryptoUtils");
const userUtils = require("./../utils/userUtils");

const processSetPasswordRequest = (req, res) => {
  const { email, previous_password, new_password } = req.body;

  userUtils
    .getUserIdFromCredentials(email, previous_password)
    .then((userSearchResult) => {
      if (!userSearchResult.success) {
        console.log(
          "Failed to find user under the email '" +
            email +
            "' and provided previous password"
        );
        res.status(400).send({
          error: "No user was found matching the provided credentials",
        });
      } else {
        let userId = userSearchResult.userId;

        cryptoUtils
          .getNewPasswordSalt()
          .then((new_hashed_password_salt) => {
            cryptoUtils
              .getHashedPassword(new_password, new_hashed_password_salt)
              .then((new_hashed_password) => {
                userUtils
                  .setUserHashedPasswordAndSalt(
                    userId,
                    new_hashed_password,
                    new_hashed_password_salt
                  )
                  .then(() => {
                    res.status(200).send({
                      message: "Password has been changed",
                    });
                  })
                  .catch(() => {
                    res.status(500).send({
                      message: "An internal server error occurred",
                    });
                  });
              })
              .catch(() => {
                res.status(500).send({
                  error: "An internal server error occurred",
                });
              });
          })
          .catch(() => {
            res.status(500).send({
              error: "An internal server error occurred",
            });
          });
      }
    });
};

module.exports = processSetPasswordRequest;
