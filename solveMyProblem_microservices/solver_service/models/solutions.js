//Model for Solution objects

module.exports = function(sequelize, DataTypes) {
    const Solutions = sequelize.define('Solutions', {
        solutionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        problemId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        solution: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        timeExecuted: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    return Solutions;
};