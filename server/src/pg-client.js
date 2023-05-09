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
    const { rowCount, rows } = await pool.query(`SELECT * FROM "user" WHERE "email"=$1`, [email]);
    return rowCount === 1 ? rows[0] : null;
  }

  async saveUser(email, password, firstName, lastName) {
    const { rows } = await pool.query(
      `INSERT INTO "user" ("email", "password", "firstName", "lastName", "emailActivated") VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, password, firstName, lastName, false]);

    return rows[0];
  }

  async saveResetToken(userId, token, expiresAt) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `DELETE FROM "passwordReset" WHERE "userId"=$1`, [userId]
      );
      await client.query(
        `INSERT INTO "passwordReset" ("userId", "token", "expiresAt") VALUES ($1, $2, $3)`, [userId, token, expiresAt]
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
      `SELECT * FROM "passwordReset" WHERE  "userId"=$1 AND "token"=$2`,
      [userId, token]);

    return rowCount == 1 ? rows[0] : null;
  }

  async changePassword(userId, token, newPassword) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE "passwordReset" SET "consumed"=true WHERE "userId"=$1 AND "token"=$2`, [userId, token]
      );
      await client.query(
        `UPDATE "user" SET "password"=$1 WHERE "id"=$2`, [newPassword, userId]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getTransactionsBySpaceId(spaceId, page, pageSize) {
    const result = await pool.query('SELECT COUNT(*) as c FROM public."transaction" WHERE "spaceId" = $1', [spaceId]);
    const count = parseInt(result.rows[0].c);

    const { rows } = await pool.query('SELECT * FROM "transaction" WHERE "spaceId"=$1 LIMIT $2 OFFSET $3', [spaceId, pageSize, pageSize * page]);
    return { totalElements: count, totalPages: count / pageSize, value: rows };
  }

  async getSpacesByUserId(userId) {
    const { rows } = await pool.query('SELECT * FROM space WHERE "userId"=$1', [userId]);
    return rows;
  }

  async createSpace(userId, name) {
    const { rows } = await pool.query('INSERT INTO space ("name", "userId") VALUES ($1, $2) RETURNING *', [name, userId]);
    return rows[0];
  }
};

module.exports = new PgClient();


