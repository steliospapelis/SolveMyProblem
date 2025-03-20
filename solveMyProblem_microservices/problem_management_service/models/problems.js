//Sequelize models for Problems , Models , Parameters and Values

module.exports = function(sequelize, DataTypes) {
    const Models = sequelize.define('Models', {
        modelId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        modelName: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        scriptPath: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    });

    const Problems = sequelize.define('Problems', {
        problemId: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        problemName: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Ready', 'Running...', 'Executed'),
            allowNull: false,
            defaultValue: 'Running...'
        },
        problemTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Models',
                key: 'modelId'
            }
        }
    });

    const Parameters = sequelize.define('Parameters', {
        parameterId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        parameterName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        parameterType: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        isRequired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        modelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Models',
                key: 'modelId'
            }
        }
    });

    const Values = sequelize.define('Values', {
        entryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        problemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Problems',
                key: 'problemId'
            }
        },
        parameterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Parameters',
                key: 'parameterId'
            }
        },
        value: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        }
    });

    // Set up model relationships
    Problems.belongsTo(Models, {foreignKey: 'problemTypeId'});
    Values.belongsTo(Problems, {foreignKey: 'problemId'});
    Values.belongsTo(Parameters, {foreignKey: 'parameterId'});
    Parameters.belongsTo(Models, {foreignKey: 'modelId'});

    return { Models, Problems, Parameters, Values };
};
