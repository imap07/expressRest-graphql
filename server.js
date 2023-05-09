const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { sequelize } = require('./src/lib/core');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const cors = require('cors');

const app = express();

// Middleware para parsear el body como JSON
app.use(cors());
app.use(express.json({ reviver: reviveJson }));

// Función para revivir JSON
function reviveJson(key, value) {
  if (value && value._isScalar) {
    const scalarValue = value._scalar;
    switch (value._scalarType) {
      case 'JSON':
        try {
          return JSON.parse(scalarValue);
        } catch (err) {
          console.error('Error al parsear valor JSON:', scalarValue, err);
        }
        break;
      default:
        console.warn('Tipo escalar desconocido:', value._scalarType);
        break;
    }
  }
  return value;
}

const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync();

    // Unificar los esquemas y resolvers de GraphQL
    const schema = makeExecutableSchema({
      typeDefs: mergeTypeDefs(typeDefs),
      resolvers: mergeResolvers(resolvers),
    });

    // Definir endpoint de GraphQL
    app.use(cors());
    app.use('/graphql', graphqlHTTP({
      schema,
      context: { db: sequelize },
      graphiql: true,
    }));
  
    app.use('/event', require("./src/routes/event.routes"));
  

    // Iniciar servidor de Express.js
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

startServer();
