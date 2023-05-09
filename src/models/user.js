const { Model, DataTypes } = require('sequelize');
const sequelize = require('../lib/core').sequelize;

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },  
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  paranoid: true,
});

exports.User = User;

class UserPassword extends Model {
}

UserPassword.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    passwordData: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: [
                'userId'
            ]
        }
    }
});
UserPassword.belongsTo(User, {
    as: 'user',
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
exports.UserPassword = UserPassword;

exports.sync = async (options = {force: false, alter: true}) => {
  console.log('user SYNC');  
  await User.sync(options);
  await UserPassword.sync(options);
};