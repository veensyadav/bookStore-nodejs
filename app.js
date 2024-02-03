const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("./db-setup/index");

const authRouter = require("./api/routes/authRouter");
const bookRouter = require("./api/routes/bookRouter");
const purchaseRouter = require("./api/routes/purchaseRouter");

const globleErrorHandler = require("./api/controllers/errorController");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/users", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/purchase",purchaseRouter);

app.use(globleErrorHandler);

module.exports = app;