
// with filter used for many subscriptions.  Remove if unused.
const { withFilter } = require('apollo-server');

module.exports = {
  Query: {
    user: {
      permissions: rules => rules.isAuthenticated,
      resolve: (root, args, { user }, info) => {
        return user.query.findById(args.id);
      },
    }
  },
  Mutation: {
    userLogin: {
      permissions: rules => rules.allow,
      resolve: (root, args, { user }, info) => {
        return user.mutation.login(args.data);
      }
    },
    userRegister: {
      permissions: rules => rules.allow,
      resolve: (root, args, { user }, info) => {
        // Passing full args through only for example.
        return user.mutation.register(args.data);
      },
    }
  }
}