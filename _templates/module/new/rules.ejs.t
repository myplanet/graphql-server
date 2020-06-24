---
to: src/modules/<%= name %>/<%= name %>.rules.js
unless_exists: true
---
const { rule } = require('graphql-shield');

const exampleRule = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return true
  },
);

// The return of the modules rules is a basic object.
module.exports = {
  exampleRule
}