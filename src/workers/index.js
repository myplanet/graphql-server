const moment = require('moment');
const { queue } = require('./queues');

const defaultTask = (data) => {
  const job = queue.createJob({ taask: "default", data})
}

module.exports = {
  defaultTask
};