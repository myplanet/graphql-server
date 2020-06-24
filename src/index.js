require('dotenv').config()

const { ApolloServer } = require('apollo-server');
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("graphql-tools");

// Start workers
require('./workers');

const { typeDefs, resolvers } = require('./modules');
const { createContext, getUser } = require('./context');
const permissions = require('./permissions');

// https://github.com/prisma-labs/graphql-middleware
const schema = applyMiddleware(
  makeExecutableSchema({
      typeDefs,
      resolvers
  }),
  // Middleware go here
  permissions
);

const server = new ApolloServer({
  schema, 
  engine: process.env.NODE_ENV === 'production',
  formatError: error => {
    if (process.env.NODE_ENV !== 'production!') {
      console.log(error);
      return error;
    }

    // Could probably have better error handling in production here with helpful errors.
    return new Error('Internal Server Error!');
  },
  context: createContext,
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      if (connectionParams.headers.Authorization) {
        const user = await getUser(connectionParams.headers.Authorization);

        return {
          auth: { user }
        };
      }

      throw new Error('Missing auth token!');
    },
  },
});

const PORT = process.env.PORT || 8000;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
