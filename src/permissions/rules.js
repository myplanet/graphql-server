// If we find up needing to collocate some rules in the modules, we can collect these rules
// in the modules index file, export them, and include them here for loading into the permissions system.
// const { rules } = require('./../modules');

const { rule, allow, deny } = require('graphql-shield');

const { rules } = require('../modules');

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return !!ctx.auth.user
  },
);

module.exports = {
  ...rules,
  allow,
  deny,
  isAuthenticated
};