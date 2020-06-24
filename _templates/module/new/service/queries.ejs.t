---
to: src/modules/<%= name %>/service/<%= name %>.queries.js
unless_exists: true
---
module.exports = (prisma, publish, services) => {
  const findById = (id) => {
    return prisma.<%= name %>({ id });
  }
  
  return {
    findById
  }
}