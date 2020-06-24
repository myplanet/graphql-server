---
to: src/modules/<%= name %>/service/<%= name %>.mutations.js
unless_exists: true
---
module.exports = (prisma, publish, services) => {

    // example of creation with subsub notification flow
    const createOne = (data) => {
      return prisma.create<%= Name %>({
        ...data
      })
      .then( <%= name %> => {
          publish.createOne(<%= name %>);
      })
    }

  return {
    createOne
  }
}