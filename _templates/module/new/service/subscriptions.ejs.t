---
to: src/modules/<%= name %>/service/<%= name %>.subscriptions.js
unless_exists: true
---
<%
 NAME = name.toUpperCase()
%>
const { <%= NAME %>_CREATE } = require('./<%= name %>.constants');

// Prisma is used to get subscription iterators for changes to models.  
// Pubsub used for creating iterators from incoming redis events
module.exports = (prisma, pubsub) => services => {

  // the pattern is slightly altered here, as we care about subscrubing to creation, whether one or many.
  const create = {
    // subscribe is the function that, we passed arguments, will return an async iterator.
    subscribe: () => {
        // Could consider using a combined approach by mergnig the prisma ierator wth the pubsub iterator
        // pubsub.asyncIterator(<%= NAME %>_CREATE);
        return prisma.$subscribe.<%= name %>({ 
          mutation_in: ['CREATED'],
        })
        .node();
    },
    // filter to be used on the subscription
    filter: (payload, variables, context) => { 
      // filter statements must return a boolean.
      return true
    },
    // resolve function is used to manipulate the payload.
    resolve: payload => payload
  }

  return {
    create
  }
}