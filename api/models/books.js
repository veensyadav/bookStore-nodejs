module.exports = (sequelize, DataTypes) => {
    const Books = sequelize.define(
        "books",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            authors: {
                type: DataTypes.STRING,
            },
            sellCount: {
                type: DataTypes.INTEGER, defaultValue: 0
            },
            title: {
                type: DataTypes.STRING, unique: true
            },
            description: {
                type: DataTypes.TEXT('long'),
            },
            price: {
                type: DataTypes.FLOAT, validate: { min: 100, max: 1000 }
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            timestamps: true,
            freezeTableName: true,
        }
    );

    Books.sync();
    return Books;
};
