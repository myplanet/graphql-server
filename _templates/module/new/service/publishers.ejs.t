---
to: src/modules/<%= name %>/service/<%= name %>.publishers.js
unless_exists: true
---
<%
 NAME = name.toUpperCase()
%>
const { <%= NAME %>_CREATE } = require('./<%= name %>.constants');

// Publishers interface takes in the pubsub instance and returns an interface
// to be used by other services, etc.
module.exports = pubsub => {

  return {
    // example publisher for the crceate one method
    createOne(<%= name %>) {
      pubsub.publish(<%= NAME %>_CREATE, <%= name %>);
    }
  }
}