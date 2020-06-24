---
to: src/modules/<%= name %>/<%= name %>.resolvers.js
unless_exists: true
---
// with filter used for many subscriptions.  Remove if unused.
const { withFilter } = require('apollo-server');

module.exports = {
  Query: {
    <%= name %>:(root, args, { <%= name %> }, info) => {
      return <%= name %>.query.findById(args.id);
    },
  },
  Mutation: {
    <%= name %>Create: (root, args, { <%= name %> }, info) => {
      // Passing full args through only for example.
      return <%= name %>.mutation.createOne(args);
    }
  },
  Subscription: {
    <%= name %>Create: {
      subscribe: withFilter(
        (root, args, { <%= name %> }, info) => {
        // this could also take in a where argument so we only listen for certain kinds of items created  
        return <%= name %>.subscription.create.subscribe();
        }, 
        (payload, variables, { <%= name %> }) => <%= name %>.subscription.create.filter(payload, variables)
      ),
      resolve: (payload, args, { <%= name %> }) => {
        return name.subscription.create.resolve(payload);
      }
    }
  },
  <%= Name %>: {
    
  }
}