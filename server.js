const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
    console.error(err.name, err.message);
    console.log("UNHANDLED EXCEPTION! Shutting down...");
    process.exit(1);
});

const NODE_ENV = process.env.NODE_ENV || 'dev';

dotenv.config({path: `${process.cwd()}/env/${NODE_ENV}.env`});

const PORT = process.env.PORT || 8080;

const app = require("./app");

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on(`unhandledRejection`, (err) => {
    console.error(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});