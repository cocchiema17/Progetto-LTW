const express = require("express");
require('express-async-errors');
const app = express();
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const resetRouter = require("./routes/reset");
const forgotRouter = require("./routes/forgot");
const currentUser = require("./routes/current-user");
const logout = require("./routes/logout");
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

app.use("/auth", loginRouter);
app.use("/auth", registerRouter);
app.use("/auth", resetRouter);
app.use("/auth", forgotRouter);
app.use("/auth", currentUser);
app.use("/auth", logout);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = app;