const { rule } = require('graphql-shield');

const exampleRule = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return true
  },
);

module.exports = {
  exampleRule
}