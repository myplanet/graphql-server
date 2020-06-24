# Permissions

Our permission system utilzies graphqll shield with some custom modifications to it that allows us to collocate our permissions alongside our resolvers, like so:

```javascript

Query: {
  user: {
    permissions: rules => rules.isAuthenticated,
    resolve: (root, args, { user }, info) => {
      return user.query.findById(args.id);
    },
  }
},
```

As can be seen, our resolver is now an object rather than a single function.  This is a benefit of graphql middleware. We define our main resolver function inside the `resolve` property.  The rest of the object can be utilized to store information that can be used by a graphql middleware.  In this case, we are using a field called `permissions`.  Permissions is a function which takes one argument, the rule set.  This rule set is injected into the permission when we load it up in our middleware, located in `shield.js`.

There is also a loading pattern provided for in the module system.  Files in the modules folder named `*.rules.js` will be loaded up into the permission system.  All rules are loaded from the modules, merged with gloabl rules defined in `rules.js`, and then injected into all resolver permissions.

All files with the name pattern `*.permissions.js` will be collected together when the function `createPermissions` from the main modules folder is called, passing in all rules.  These rules are provided to the permission constructor, `createPermissions` in the modules folder which returns an object of the rule definitions which are loaded into shield in `permissions/index.js`.

