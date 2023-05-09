const { Model, DataTypes } = require('sequelize');
const sequelize = require('../lib/core').sequelize;
const user = require('./user');

class Event extends Model {}

Event.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },  
  title: {
    type: DataTypes.STRING,
    allowNull: false,    
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,    
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,    
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,    
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,    
  }
}, {
  sequelize,
  modelName: 'Event',
  timestamps: true,
  paranoid: true,
});

exports.Event = Event;

class UserEvent extends Model {
}

UserEvent.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      allowNull: false,
      defaultValue: "pending"
    }
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
      include: [
          {
              model: user.User,
              as: 'user'
          },
      ]
    }
});
UserEvent.belongsTo(Event, {
  as: 'event',
  foreignKey: {
      name: 'eventId',
      allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
UserEvent.belongsTo(user.User, {
    as: 'user',
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
exports.UserEvent = UserEvent;
exports.sync = async (options = {force: false, alter: true}) => {
  console.log('event SYNC');  
  await Event.sync(options);
  await UserEvent.sync(options);
};