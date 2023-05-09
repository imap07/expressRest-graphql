const { Sequelize } = require('sequelize');

// Configurar Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './prueba.db'
});

// Conectar a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch((err) => {
    console.error('Error al conectarse a la base de datos:', err);
  });

module.exports = { sequelize };
