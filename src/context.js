const jwt = require("jsonwebtoken")

const { connections, services } = require('./modules');
const constants = require('./config/constants');
const workerQueue = require('./workers');

const jwtSecret = process.env.JWT_SECRET;

const getUser = async rawToken => {
  let token = '';
  if (rawToken.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = rawToken.slice(7, rawToken.length);
  }
  
  try {
    const decoded = await jwt.verify(token, Buffer.from(jwtSecret, 'base64'));
    let user = false;
  
    if (decoded) {
      user = await services.user.query.findByEmail(decoded.email);
    }
    
    return user;

  } catch (err) {
    console.log(err);
    return false;
  }
}

const createContext = async ({ req, connection }) => {
  let context = {};
  let user = false;

  if(connection) {
    context = { ...connection.context }
  }
  
  if(req) {
    const token = req.headers.authorization || false;
  
    // Returns user if valid token and false if invalid token
    if (token) {
      user = await getUser(token);
    }
  }

  return {
    auth: { user },
    ...context,
    constants, 
    ...connections,
    // Attach all services to the context for use in the resolvers
    ...services,
    // tihs namespace is temporary.  There is likely a better name for this service.
    workerQueue
  }
}

module.exports = {
  createContext,
  getUser
};