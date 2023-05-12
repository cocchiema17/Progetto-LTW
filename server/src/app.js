const express = require("express");
require('express-async-errors');

const app = express();
const loginRouter = require("./routes/login-router");
const registerRouter = require("./routes/register-router");
const resetRouter = require("./routes/reset-router");
const forgotRouter = require("./routes/forgot-router");
const currentUser = require("./routes/current-user-router");
const logout = require("./routes/logout-router");
const space = require("./routes/space-router");
const transaction = require("./routes/transaction-router");

const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");
const cookieParser = require("cookie-parser")
const cors = require('cors');

app.disable('x-powered-by');
app.disable('etag');
app.disable('date');

const corsOptions = {
  origin: "http://localhost:8080",
  methods: "GET,PATCH,POST,DELETE"
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)) // include before other routes

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", loginRouter);
app.use("/api/auth", registerRouter);
app.use("/api/auth", resetRouter);
app.use("/api/auth", forgotRouter);
app.use("/api/auth", currentUser);
app.use("/api/auth", logout);

app.use("/api", space);
app.use("/api", transaction);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;