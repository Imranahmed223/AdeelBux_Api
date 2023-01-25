const jwt = require("jsonwebtoken");

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, "This is secret", {
      expiresIn: "1y",
    });
  };


  module.exports = generateJwtToken