const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const jwtExpirySeconds = 10000000; 
const jwtSecret = process.env.JWT_SECRET;

module.exports = (prisma, publish, services) => {

    // example of creation with subsub notification flow
    const register = async ({ email, password, ...data}) => {
      // create user
      // check exsistence of users email
      const emailExists = await prisma.$exists.user({
        email: email
      });
      
      if (emailExists) {
        throw new Error('Email already in use');
      }

      // hash password with bcrypt
      try {
        const passwordHash = await bcrypt.hash(password, saltRounds);

        return prisma.createUser({
          ...data,
          email: email,
          password: passwordHash
        });

      } catch(err) {
        console.log(err);
        throw new Error('Invalid credentials');
      }
    }

    const login = async data => {
      // check for user email
      const user = await prisma.user({ email: data.email });

      const valid = await bcrypt.compare(data.password, user.password);

      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const payload = {
        email: data.email
      }

      const token = jwt.sign(payload, Buffer.from(jwtSecret, 'base64'),  {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      });

      return {
        user,
        token
      }
      // Use bcrypt to validate password
      // Generate JWT token for user
      // Send JWT token to client
    }

  return {
    register,
    login
  }
}