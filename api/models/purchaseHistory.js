module.exports = (sequelize, DataTypes) => {
    const PurchaseHistory = sequelize.define(
        "purchaseHistory",
        {
            purchaseId: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            purchaseDate: {
                type: DataTypes.DATE, allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT, allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER, allowNull: false,
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

    PurchaseHistory.sync();
    return PurchaseHistory;
};
