const express = require("express");
// const morgan = require("morgan");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("./db-setup/index");

const userRouter = require("./api/routes/userRoutes");

const app = express();

// if (process.env.NODE_ENV === "dev") {
//     app.use(morgan("dev"));
//   }

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/api/contacts", (req, res)=>{
    res.send("Get all contacts");
})

app.use("/api/v1/userAuth", userRouter);

module.exports = app;