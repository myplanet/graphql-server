require('dotenv').config()
const moment = require('moment');

const { pubsub, prisma, services, redis } = require('../modules');

const { experimentQueue } = require('./queues');

experimentQueue.process(async (job, done) => {
  const { task, experiment} = job.data;

  switch (task) {
    case "default":
      // here you can utilize any service or connection in the worker process.
      // Good for long running or processing heavy tasks.
      console.log("Default task activated");
      break;

    default:
      break;
  }
});