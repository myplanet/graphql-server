---
to: src/modules/<%= name %>/service/<%= name %>.listeners.js
unless_exists: true
---
<%
 NAME = name.toUpperCase()
%>
// Pubsub for listening to events.  Servces is used in case listener
// needs to respond to an incoming event with another service.

const { <%= NAME %>_CREATE } = require('./<%= name %>.constants');

module.exports = function(pubsub, services) {
  // Get the subscriber directly from the redis graphql pubsub

  pubsub.subscribe(<%= NAME %>_CREATE,  data => {
    console.log("new <%= name %>!", data);
  })
};