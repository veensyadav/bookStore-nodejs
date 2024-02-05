module.exports = (sequelize, DataTypes) => {
    const PurchaseHistory = sequelize.define(
        "purchaseHistory",
        {
            purchaseId: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            purchaseDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            timestamps: true,
            freezeTableName: true,
            hooks: {
                beforeCreate: async (purchaseHistory, options) => {
                    // Get the latest auto-incremented ID
                    const latestId = await PurchaseHistory.max('purchaseId');
                    // Increment the ID for the numeric part
                    const numericPart = latestId ? parseInt(latestId.split('-')[2]) + 1 : 1;

                    // Auto-generate purchaseId based on the desired format
                    purchaseHistory.purchaseId = generatePurchaseId(numericPart);
                },
            },
        }
    );

    PurchaseHistory.sync()
    return PurchaseHistory;
};

// Function to generate the custom purchaseId
function generatePurchaseId(numericPart) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    return `${year}-${month}-${numericPart.toString().padStart(4,'0')}`;
}