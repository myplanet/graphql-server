# Module System

Our module system is very flexible. At the base of the modules folder is the main index, which is responsible for auto-loading all files from the modules, including schemas, resolvers, services, and listeners and then exporting them out to be used by the main apollo server configuration. This has been done to allow to an easy extensible architecture. A single moddule is a predictable unit of code sharinig certain interfaes. The structure of a module looks like the following:

```
myModule
|--- __test__
|--- service
|   |--- myModule.constants.js
|   |--- myModule.listeners.js
|   |--- myModule.mutations.js
|   |--- myModule.publishers.js
|   |--- myModule.queries.js
|   |--- myModule.subscriptions.js
|   |--- index.js
|--- myModule.graphql
|--- myModule.resolvers.js
```

The root modules index is responsible for gathering up all modules, and exporting them as a service object which is spread into the main apollo context. This makes each module acessible on the context and usable inside the resolvers.

Every module exports a service, whose shape is as follows:

```
{
    query,
    mutation,
    subscription,
    publish
}
```

It is recommended to keep naming conventions across the different service functions similar for ease of access.  For example:

```javascript
  myModyle.query.findOne();
  myModule.mutation.createOne();
  // This subscribe breaks the pattern, as we only care in subscriptions about each new myModule created, not one or many.
  myModule.subscribe.create();
  myModule.publish.createOne();
```

This gives a predictable interface for how to use any one module, and makes the publish and subscribe events similar to one another.

One benefit of this structure is that each sub-service is easy to test in isolation.  Both prisma and the pubsub initerface are injected into the module on initialization, which mmeans they can be stubbed and spied on to ensure they are called on in a test.  Each sub-service can be tested iin isolation, and then the whole can be tested with API integration tests.

Also, since services are now abstractd from resolvers, services can be swapped out, for example if we were to migrate away from Prisma, we can implement each service method.  

## Notes

A model could be added to the service, `myModule.model.js` which would contain an possible asbtraction for accessing the modules relationships.  Right now on the type level are still accessing prisma directly for relationships.
