const { Sequelize, DataTypes } = require("sequelize");

const userAuth = require("../api/models/userModel");
const dataSet = require("../api/models/assignment_data")

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


db.userAuth = userAuth(sequelize, DataTypes);
db.dataSet = dataSet(sequelize, DataTypes);


db.sequelize.sync({ alter: true }).then(() => {
    console.log("DB re-sync done...");
}).catch((err)=>{
    console.log("err",err)
});

module.exports = db;