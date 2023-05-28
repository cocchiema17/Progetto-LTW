const { Pool } = require('pg');

require("dotenv").config()

const keys = require("./src/keys");
const { faker } = require("@faker-js/faker");


const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const categories = ["Food", "Clothes", "Travel", "Fun"];


for (let i = 0; i < 75; i++) {
  const n = faker.commerce.price(0.01, 100000.00);
  const y = i % 2 == 0;
  pool.query(`INSERT INTO public.transaction(
    title, description, type, value, "categoryName", "spaceId", "transactionDate")
    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
    faker.lorem.words(3),
    faker.commerce.productDescription(),
    y ? "expense" : "revenue",
    y ? parseFloat('-' + n) : parseFloat(n),
    faker.helpers.arrayElement(categories),
    4,
    faker.date.past(9)
  ]);
}
