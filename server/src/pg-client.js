const { Pool } = require("pg");
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
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM "user" WHERE "email"=$1`,
      [email]
    );
    return rowCount === 1 ? rows[0] : null;
  }

  async saveUser(email, password, firstName, lastName) {
    const { rows } = await pool.query(
      `INSERT INTO "user" ("email", "password", "firstName", "lastName", "emailActivated") VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, password, firstName, lastName, false]
    );

    return rows[0];
  }

  async saveResetToken(userId, token, expiresAt) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM "passwordReset" WHERE "userId"=$1`, [
        userId,
      ]);
      await client.query(
        `INSERT INTO "passwordReset" ("userId", "token", "expiresAt") VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async getResetToken(userId, token) {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM "passwordReset" WHERE  "userId"=$1 AND "token"=$2`,
      [userId, token]
    );

    return rowCount == 1 ? rows[0] : null;
  }

  async changePassword(userId, token, newPassword) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `UPDATE "passwordReset" SET "consumed"=true WHERE "userId"=$1 AND "token"=$2`,
        [userId, token]
      );
      await client.query(`UPDATE "user" SET "password"=$1 WHERE "id"=$2`, [
        newPassword,
        userId,
      ]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async getUserTransactions(userId, page, pageSize) {
    const result = await pool.query(
      'SELECT COUNT(*) as c FROM transaction t JOIN space s ON t."spaceId" = s.id WHERE "userId" = $1',
      [userId]
    );
    const count = parseInt(result.rows[0].c);

    const { rows } = await pool.query(
      'SELECT t.*, s."name" as "spaceName", s."userId" FROM transaction t JOIN space s ON t."spaceId" = s.id WHERE "userId" = $1 ORDER BY "transactionDate" DESC LIMIT $2 OFFSET $3',
      [userId, pageSize, pageSize * page]
    );

    return {
      totalElements: count,
      totalPages: Math.ceil(count / pageSize),
      value: rows,
    };
  }

  async getUserSpaces(userId) {
    const { rows } = await pool.query('SELECT * FROM space WHERE "userId"=$1', [
      userId,
    ]);
    return rows;
  }

  async getUserCategories(userId) {
    const { rows } = await pool.query(
      'SELECT c.*, s.name as "spaceName" FROM category c JOIN space s ON c."spaceId" = s.id WHERE s."userId" = $1',
      [userId]
    );
    return rows;
  }

  async createSpace(userId, name) {
    const { rows } = await pool.query(
      'INSERT INTO space ("name", "userId") VALUES ($1, $2) RETURNING *',
      [name, userId]
    );
    return rows[0];
  }

  async createTransaction(payload) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO category (name, "spaceId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [payload.categoryName, payload.spaceId]
      );

      const { rows } = await client.query(
        `
        INSERT INTO transaction (title, description, type, value, "categoryName", "spaceId", "transactionDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          payload.title,
          payload.description,
          payload.value > 0 ? "revenue" : "expense",
          Math.abs(payload.value),
          payload.categoryName,
          payload.spaceId,
          payload.date,
        ]
      );

      await client.query("COMMIT");

      return rows[0];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async getFilteredUserTransactions(
    userId,
    // page,
    // pageSize,
    search,
    space,
    category
  ) {
    const result = await pool.query(
      `SELECT t.title, t.description, t."value", t."categoryName", t."transactionDate", s.name
      FROM public.transaction t join public.space s on t."spaceId" = s.id join public."user" u ON u.id = s."userId"
      WHERE u.id = ${userId}
      ${category ? 'AND t."categoryName" = ' + category : ""}
      ${space ? "AND s.name = " + space : ""} AND 
      (t.title ILIKE '%${search}%' or t.description ILIKE '%${search}%')`
    );

    console.log(result);

    // const count = parseInt(result.rows[0].c);

    // const { rows } = await pool.query(
    //   'SELECT t.*, s."name" as "spaceName", s."userId" FROM transaction t JOIN space s ON t."spaceId" = s.id WHERE "userId" = $1 ORDER BY "transactionDate" DESC LIMIT $2 OFFSET $3',
    //   [userId, pageSize, pageSize * page]
    // );

    // return {
    //   totalElements: count,
    //   totalPages: Math.ceil(count / pageSize),
    //   value: rows,
    // };
  }
}

module.exports = new PgClient();
