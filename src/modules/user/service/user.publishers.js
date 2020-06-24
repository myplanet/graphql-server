


const { USER_CREATE } = require('./user.constants');


// Publishers interface takes in the pubsub instance and returns an interface
// to be used by other services, etc.
module.exports = pubsub => {

  return {
    // example publisher for the crceate one method
    createOne(user) {
      pubsub.publish(USER_CREATE, user);
    }
  }
}