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

  async getUserTransactions(userId, filters_param, sort_param) {
    const {
      page,
      pageSize,
      categoryName,
      space,
      search,
      amount,
      operator,
      amount2,
    } = filters_param;
    const { sortColumn, asc } = sort_param;
    const filters = [];

    if (categoryName) {
      filters.push(`t."categoryName" = '${categoryName}'`);
    }

    if (space) {
      filters.push(`s."name" = '${space}'`);
    }

    if (search) {
      filters.push(
        `(title ILIKE '%${search}%' OR description ILIKE '%${search}%')`
      );
    }

    if (operator) {
      switch (operator) {
        case "EQ":
          filters.push(`t."value" = ${amount}`);
          break;
        case "NE":
          filters.push(`t."value" != ${amount}`);
          break;
        case "GT":
          filters.push(`t."value" > ${amount}`);
          break;
        case "GE":
          filters.push(`t."value" >= ${amount}`);
          break;
        case "LT":
          filters.push(`t."value" < ${amount}`);
          break;
        case "LE":
          filters.push(`t."value" <= ${amount}`);
          break;
        case "BT":
          filters.push(`(t."value" >= ${amount} AND t."value" <= ${amount2})`);
          break;
      }
    }

    const result = await pool.query(
      `SELECT COUNT(*) as c FROM transaction t JOIN space s ON t."spaceId" = s.id WHERE "userId" = $1
        ${filters.length > 0 ? " AND " : ""}  ${filters.join(" AND ")}`,
      [userId]
    );
    const count = parseInt(result.rows[0].c);
    const sortStatement = sortColumn ? `"${sortColumn}"` : '"transactionDate"';

    const { rows } = await pool.query(
      `SELECT t.*, s."name" as "spaceName", s."userId", ROW_NUMBER() OVER ( ORDER BY ${sortStatement} ${asc == "ASC" ? "ASC" : "DESC"} ) 
        FROM transaction t JOIN space s ON t."spaceId" = s.id WHERE "userId" = $1
       ${filters.length > 0 ? " AND " : ""} ${filters.join(
        " AND "
      )} LIMIT $2 OFFSET $3`,
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
        `INSERT INTO transaction (title, description, type, value, "categoryName", "spaceId", "transactionDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          payload.title,
          payload.description,
          payload.value > 0 ? "revenue" : "expense",
          payload.value,
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

  // TO DO
  async deleteTransacrion(id) {
    await pool.query(`DELETE FROM "transaction" WHERE id = $1`, [id]);
  }

  async getBarChartData(userId, spaceId, fromDate, toDate) {
    // 2 barre verticali per mese: entrate e uscite per uno space

    const filters = [];

    filters.push(`"userId" = '${userId}'`);

    filters.push(`"spaceId" = '${spaceId}'`);

    if (fromDate) {
      filters.push(`"transactionDate" >= '${fromDate}'`);
    }

    if (toDate) {
      filters.push(`"transactionDate" <= '${toDate}'`);
    }

    const { rows } = await pool.query(`
    SELECT 
    type,
    COUNT(*) as count,
    SUM(value) as total,
    date_part('year', "transactionDate"::date) as year,
    date_part('month', "transactionDate"::date) as month 
    FROM transaction t JOIN space s ON t."spaceId" = s."id"
    WHERE ${filters.join(" AND ")}
    GROUP BY "type", year, month
    ORDER BY year, month`
    );

    return rows;
  }

  async getPieChartData(userId, spaceId, fromDate, toDate) {
    // torta che conta le categorie in uno space


    const filters = [];

    filters.push(`"userId" = '${userId}'`);

    filters.push(`"spaceId" = '${spaceId}'`);

    if (fromDate) {
      filters.push(`"transactionDate" >= '${fromDate}'`);
    }

    if (toDate) {
      filters.push(`"transactionDate" <= '${toDate}'`);
    }

    const { rows } = await pool.query(
      `SELECT "categoryName", COUNT(*) FROM transaction t JOIN space s ON t."spaceId" = s."id" WHERE ${filters.join(" AND ")} GROUP BY "categoryName"`);
    return rows;
  }

  async getLineChartData(userId, spaceId, fromDate, toDate) {
    // torna il valore di uno space sempre su base mensile
    const filters = [];

    filters.push(`"userId" = '${userId}'`);

    filters.push(`"spaceId" = '${spaceId}'`);

    if (fromDate) {
      filters.push(`"transactionDate" >= '${fromDate}'`);
    }

    if (toDate) {
      filters.push(`"transactionDate" <= '${toDate}'`);
    }

    const { rows } = await pool.query(`
    WITH subquery AS  (
        SELECT
            date_part('year', "transactionDate"::date) as year,
            date_part('month', "transactionDate"::date) as month,
            SUM(value) AS value
          FROM transaction t JOIN space s ON t."spaceId" = s."id"
          WHERE ${filters.join(" AND ")}
        GROUP BY
            date_part('month', "transactionDate"::date),
      date_part('year', "transactionDate"::date) 
        ORDER BY
      date_part('year', "transactionDate"::date),
            date_part('month', "transactionDate"::date)
    )   
    SELECT
      A.year,
        A.month,
        SUM(B.value) AS value
    FROM
        subquery A
      JOIN subquery B 
      ON ((B.year < A.year OR (B.year = A.year and B.month <= A.month)) )
    GROUP by A.year, A.month
    ORDER by A.year, A.month ASC`
    );
    return rows;
  }

  // TO DO
  async deleteTransacrion() { }
}

module.exports = new PgClient();
