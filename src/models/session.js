const { Model, DataTypes } = require('sequelize');
const sequelize = require('../lib/core').sequelize;
    user = require('./user');
    
class Session extends Model {}
Session.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    loggedOutAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    connected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: user.User,
                as: 'user',
                required: true
            }
        ]
    }
});
Session.belongsTo(user.User, {
    as: 'user',
    foreignKey: 'userId'
});
exports.Session = Session;

exports.sync = async(options = {force: false, alter: true}) => {
    console.log('session SYNC');
    await Session.sync(options);
};
