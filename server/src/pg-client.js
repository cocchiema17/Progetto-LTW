const { Pool } = require('pg');
const keys = require("./keys");

const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

class PgClient {
  async findUserByEmail(email) {
    const { rowCount, rows } = await pool.query(`SELECT * FROM "finager.user" WHERE "email"=$1`, [email]);
    return rowCount === 1 ? rows[0] : null;
  }

  async saveUser(email, password, firstName, lastName) {
    const { rows } = await pool.query(
      `INSERT INTO "finager.user" ("email", "password", "firstName", "lastName", "emailActivated") VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, password, firstName, lastName, false]);

    return rows[0];
  }

  async saveResetToken(userId, token, expiresAt) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `DELETE FROM "finager.passwordReset" WHERE "userId"=$1`, [userId]
      );
      await client.query(
        `INSERT INTO "finager.passwordReset" ("userId", "token", "expiresAt") VALUES ($1, $2, $3)`, [userId, token, expiresAt]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getResetToken(userId, token) {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM "finager.passwordReset" WHERE  "userId"=$1 AND "token"=$2`,
      [userId, token]);

    return rowCount == 1 ? rows[0] : null;
  }

  async changePassword(userId, token, newPassword) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE "finager.passwordReset" SET "consumed"=true WHERE "userId"=$1 AND "token"=$2`, [userId, token]
      );
      await client.query(
        `UPDATE "finager.user" SET "password"=$1 WHERE "id"=$2`, [newPassword, userId]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

module.exports = new PgClient();


