//Session model

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Sessions', {
        sid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        expires: {
            type: DataTypes.DATE
        },
        data: {
            type: DataTypes.TEXT
        }
    });
};
