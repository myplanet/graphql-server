
module.exports = (prisma, publish, services) => {
  const findById = (id) => {
    return prisma.user({ id });
  }

   const findByEmail = email => {
     return prisma.user({ email })
   }
  
  return {
    findById,
    findByEmail
  }
}