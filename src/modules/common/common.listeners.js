module.exports = function({ pubsub }) {
  const subscriber = pubsub.getSubscriber();
  
  subscriber.on('error', (err) => {
    console.error('whoops! there was an error');
  });
}