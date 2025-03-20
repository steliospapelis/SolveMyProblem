//Sequelize model for User object.

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Users', {
        userId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(40),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        credits: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 0,                      // 0 for regular user, 1 for admin
            allowNull: false
        }
})
};

