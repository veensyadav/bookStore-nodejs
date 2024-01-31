const { Sequelize, DataTypes } = require("sequelize");

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_TYPE } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_TYPE,
    logging: false,
});

sequelize
    .authenticate()
    .then(() => console.log("Database Connected..."))
    .catch((err) => console.log("Error: ", err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.sequelize.sync({ alter: true }).then(() => {
    console.log("DB re-sync done...");
}).catch((err)=>{
    console.log("err",err)
});

module.exports = db;