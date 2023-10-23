const cryptoUtils = require("./../utils/cryptoUtils");
const userUtils = require("./../utils/userUtils");

const processSetPasswordRequest = (req, res) => {
  const { email } = req.body;

  userUtils.getUserIdFromEmail(email).then((userSearchResult) => {
    if (!userSearchResult.success) {
      console.log("Failed to find user under the email '" + email + "'");
      res.status(400).send({
        error: "No user was found matching the provided credentials",
      });
    } else {
      let userId = userSearchResult.userId;

      cryptoUtils
        .getNewPasswordSalt()
        .then((new_hashed_password_salt) => {
          cryptoUtils
            .getNewPassword()
            .then((new_plaintext_password) => {
              cryptoUtils
                .getHashedPassword(
                  new_plaintext_password,
                  new_hashed_password_salt
                )
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
                        new_password: new_plaintext_password,
                      });
                    })
                    .catch(() => {
                      res.status(500).send({
                        message: "An internal server error occurred (4)",
                      });
                    });
                })
                .catch(() => {
                  res.status(500).send({
                    error: "An internal server error occurred (3)",
                  });
                });
            })
            .catch(() => {
              res.status(500).send({
                error: "An internal server error occurred (2)",
              });
            });
        })
        .catch(() => {
          res.status(500).send({
            error: "An internal server error occurred (1)",
          });
        });
    }
  });

  cryptoUtils
    .getNewPassword(email)
    .then((new_plaintext_password) => {})
    .catch(() => {
      res.status(500).send({
        error: "An internal server error occurred",
      });
    });
};

module.exports = processSetPasswordRequest;
