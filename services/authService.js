const users = require('../mocks/users');

function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    return null;
  }

  const { password: ignoredPassword, ...safeUser } = user;
  return safeUser;
}

module.exports = { login };