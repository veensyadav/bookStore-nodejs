module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "user",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        firstName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING,
        },
        AdminID: {
          type: DataTypes.STRING,
        },
        user_Type: {
          type: DataTypes.STRING,
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
  
    User.sync();
    return User;
  };
  