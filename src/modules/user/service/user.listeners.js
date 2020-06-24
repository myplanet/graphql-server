


// Pubsub for listening to events.  Servces is used in case listener
// needs to respond to an incoming event with another service.

const { USER_CREATE } = require('./user.constants');

module.exports = function(pubsub, services) {
  // Get the subscriber directly from the redis graphql pubsub

  pubsub.subscribe(USER_CREATE,  data => {
    console.log("new user!", data);
  })
};