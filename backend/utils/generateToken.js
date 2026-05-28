const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123_indian_tax_planner_app', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
