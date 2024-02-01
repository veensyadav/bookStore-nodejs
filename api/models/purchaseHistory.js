module.exports = (sequelize, DataTypes) => {
    const PurchaseHistory = sequelize.define(
        "purchaseHistory",
        {
            purchaseId: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: function () {
                    const date = new Date();
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    // get the latest purchase ID for the current month and increment it
                    return `${year}-${month}-${numericIncrementId}`;
                },
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
