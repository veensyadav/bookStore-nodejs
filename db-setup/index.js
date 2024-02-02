const { Sequelize, DataTypes } = require("sequelize");

const users = require("../api/models/userModel");
const books = require("../api/models/books");
const purchaseHistory = require("../api/models/purchaseHistory");

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

db.users = users(sequelize, DataTypes);
db.books = books(sequelize, DataTypes);
db.purchaseHistory = purchaseHistory(sequelize, DataTypes);



// Relationships

db.users.hasMany(db.purchaseHistory);
db.purchaseHistory.belongsTo(db.users);

db.books.hasMany(db.purchaseHistory);
db.purchaseHistory.belongsTo(db.books);

// db.users.hasMany(db.books);
// db.books.belongsTo(db.users);


db.sequelize.sync({ alter: true }).then(() => {
    console.log("DB re-sync done...");
}).catch((err)=>{
    console.log("err",err)
});

module.exports = db;