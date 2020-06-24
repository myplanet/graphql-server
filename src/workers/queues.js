const Queue = require('bee-queue');

const queue = new Queue('experiment', {
  redis: {
    url: `redis://${process.env.REDIS_URL}` || "redis://127.0.0.2:6379"
  },
  activateDelayedJobs: true
});

module.exports = {
  queue
}