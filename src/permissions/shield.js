const _ = require('lodash/fp');
const graphqlShield = require('graphql-shield');
const { middleware } = require('graphql-middleware');

// All rules are pulled in from the rules file.

const rules = require('./rules');

// code taken from https://github.com/maticzav/graphql-shield/issues/152#issue-361238010
// With slight modification and added comments.

// Here we are augmenting the main graphqk shield function.
// We use the middleware generator to iterate over the entire schema looking for
// any key that matchesx the given provided permission key.
function shield(initialPermissions = {}, options = {}) {
  const { permissionsKey = 'permissions', ...shieldOptions } = options

  // Use middleware generatpr to access the schema
  return middleware(schema => {

    // Merge any initial permissions with those collected from the schema.

    const permissions = _.merge(
      initialPermissions,
      collectPermissions(schema, permissionsKey)
    )
    // use the new permisions to initialize the shield and generate the schema
    return graphqlShield.shield(permissions, shieldOptions).generate(schema)
  })
}

// This function will 
function collectPermissions(schema, permissionsKey) {
  // We can use these schema methods to get the query and mutation fields
  const resolvers = {
    Query: schema.getQueryType() ? schema.getQueryType().getFields() : {},
    Mutation: schema.getMutationType() ? schema.getMutationType().getFields() : {},
    Subscription: schema.getSubscriptionType() ? schema.getSubscriptionType().getFields() :{}
  }
  let permissions = {}

  // Iterate over each typename here in the resolver object
  for (const typeName in resolvers) {
    const fieldResolvers = resolvers[typeName];

    // iterate over all resolvers for that type
    for (const fieldName in fieldResolvers) {
      const fieldResolver = fieldResolvers[fieldName];

      // Here we check to see if there is a permission property on that resolver
      if (fieldResolver[permissionsKey]) {

        // Here we pass the entire st of rules out into the permission property, which is a function
        // And expects the rules to be passed in.  It then returns the rules which needed by the resolver.
        const permission = fieldResolver[permissionsKey](rules);

        // set the new permission onto the permissions object.
        permissions = _.set(
          [ typeName, fieldName ],
          permission,
          permissions
        )
      }
    }
  }

  return permissions
}

// We export the entire graphqlShield library, but we overwrite the shield method with our own.
module.exports = {
  ...graphqlShield,
  shield
}