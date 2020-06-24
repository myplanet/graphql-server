const RedisPubSub = require('graphql-redis-subscriptions').RedisPubSub;
const Redis = require('ioredis');
const host = process.env.REDIS_LOCAL || 'localhost';

const options = {
  host,
  retryStrategy: times => {
    // reconnect after
    return Math.min(times * 50, 2000);
  }
};

module.exports =  {
  name: 'pubsub',
  interface: new RedisPubSub({
    publisher: new Redis(process.env.REDIS_URL, options),
    subscriber: new Redis(process.env.REDIS_URL, options)
  })
}