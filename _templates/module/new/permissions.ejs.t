---
to: src/modules/<%= name %>/<%= name %>.permissions.js
unless_exists: true
---

<%
 NAME = name.toUpperCase()
%>
// This is a very basic example of a type level permission.
// It will be noticed that the whole rule set it injected in and return and object which uses it
module.exports = rules => ({
  <%= Name %>: rules.allow
})