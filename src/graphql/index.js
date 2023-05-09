const { makeExecutableSchema } = require('graphql-tools');
const { resolvers } = require('./resolvers/user.resolver');
const typeDefs = require('../index');

// Crear schema de GraphQL
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = { schema };