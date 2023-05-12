const { Pool } = require('pg');

require("dotenv").config()

const keys = require("./src/keys");
const { faker } = require("@faker-js/faker");

console.log(keys)

const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const categories = ["Food", "Clothes", "Personal", "Travel", "Gym"];

for (let i = 0; i < 30; i++) {
  let x = i % 2 == 0;
  pool.query(`INSERT INTO public.transaction(
    title, description, type, value, currency, "categoryName", "spaceId", "transactionDate")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
    x ? "Buy" : "Sell " + faker.commerce.product(),
    faker.commerce.productDescription(),
    x ? "expense" : "revenue",
    faker.commerce.price(),
    faker.finance.currencyCode(),
    faker.helpers.arrayElement(categories),
    2,
    faker.date.past(1)
  ]);
}

