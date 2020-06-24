const { shield } = require('./shield');
const rules = require('./rules');
const { createPermissions } = require('../modules');

// We pass use the created rules set generate the permissions provided by the module system
const modulePermissions = createPermissions(rules);

console.log(modulePermissions);

const permissions = shield({
  ...modulePermissions,
  Query: {
    "*": rules.isAuthenticated
  },
  Mutation: {
    "*": rules.isAuthenticated,
  }
}, {
  fallbackRule: rules.allow,
  allowExternalErrors: true
})

module.exports = permissions;