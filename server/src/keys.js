module.exports = Object.freeze({
  pgUser: process.env.PG_USER,
  pgHost: process.env.PG_HOST,
  pgDatabase: process.env.PG_DATABASE,
  pgPassword: process.env.PG_PASSWORD,
  pgPort: process.env.PG_PORT,
  jwtKey: process.env.JWT_KEY
});
