const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign(
    { id }, // Payload: User's ID
    process.env.JWT_SECRET_KEY, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration (90 days)
    }
  );
};

module.exports = { signToken };
