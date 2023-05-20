const express = require("express");
require('express-async-errors');

const app = express();
const loginRouter = require("./routes/auth/login-router");
const registerRouter = require("./routes/auth/register-router");
const resetRouter = require("./routes/auth/reset-router");
const forgotRouter = require("./routes/auth/forgot-router");
const currentUser = require("./routes/auth/current-user-router");
const logout = require("./routes/auth/logout-router");

const category = require("./routes/category-router");
const space = require("./routes/space-router");
const transaction = require("./routes/transaction-router");

const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");
const cookieParser = require("cookie-parser")
const cors = require('cors');

app.use("*", cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST']
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", loginRouter);
app.use("/api/auth", registerRouter);
app.use("/api/auth", resetRouter);
app.use("/api/auth", forgotRouter);
app.use("/api/auth", currentUser);
app.use("/api/auth", logout);

app.use("/api", category);
app.use("/api", space);
app.use("/api", transaction);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;