---
to: src/modules/<%= name %>/service/<%= name %>.constants.js
unless_exists: true
---
<%
 NAME = name.toUpperCase()
%>
// Use this file to centralize constants used within the service.

exports.<%= NAME %>_CREATE = "<%= name %>:create";
