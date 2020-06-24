---
to: src/modules/<%= name %>/service/index.js
unless_exists: true
---
/*
  services could be used as an abstraction of the core resolver logic into only a single reusable function.
  constructor function is called to give it access to prisma and the event emitter. It returns the interface,
  which is attached to the context and consumed by the resolver.

  An interface provides all methods used by the resolver to accomplish its purposes.  These are:
  - query
  - mutation
  - subscribe
  - publish

  Possible usages of a service interface:

  <%= name %>.publish.updateOne();
  <%= name %>.subscribe.updateOne();
  <%= name %>.mutation.updateOne();
  <%= name %>.publish.updateMany();
  <%= name %>.subscribe.updateMany();
  <%= name %>.mutation.updateMany();

  Listers are also include in the service folder, though they are loaded in separately inside the modules root.
  This allows the listeners to have access to all services in the application, just in case the listeners need
  to call another service to accomplish some task.
*/

const createPublishers = require('./<%= name %>.publishers');
const createMutations = require('./<%= name %>.mutations');
const createQueries = require('./<%= name %>.queries');
const createSubscriptions = require('./<%= name %>.subscriptions');
const createType = require('./<%= name %>.type');

module.exports = (prisma, pubsub) => services => {
  const publishers = createPublishers(pubsub);
  const queries = createQueries(prisma, publishers, services);
  const mutations = createMutations(prisma, publishers, services);
  const subscriptions = createSubscriptions(prisma, pubsub);
  const type = createType(prisma, services);

  return {
    type,
    publish: publishers,
    query: queries,
    mutation: mutations,
    subscription: subscriptions,
  }
}