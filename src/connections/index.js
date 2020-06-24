/* 
Here we are going to run through every file and folder in the connections folder
and load them up into a single object for export.  This object is consumed by the module system
to automatically inject all connections into the context for use by resolvers and services.
A connection can be in either a filer or a folder. The connection consists of an object with two
properties currently.  The interface should look like this:

  {
    name: 'myInterface',
    interface: {}
  }

The name is used when loading the connection for inclusion in the connection object,
and the interface is association to the name as the primary interface for use by the application.

The connection object could be expanded to include possibel configuration options being passedd in,
an initialization functions, etc.
*/

const glob = require('glob');
const path = require('path');

// Load up all connections which are in a single file
const files = glob.sync(path.join(__dirname, './*.js'), { ignore: '**/index.js' }).reduce((acc, path) => {
  const connection = require(path);
  acc[connection.name] = connection.interface;
  return acc;
}, {});

// Load up all connection which are contained as a folder.
// These might consist of connections to external API's, along with their helper libraries for communication
// Or mongo DB connections as well as models.
const folders = glob.sync(path.join(__dirname, './**/index.js')).reduce((acc, path) => {
  const connection = require(path);
  acc[connection.name] = connection.interface;
  return acc;
}, {});

module.exports = {
  ...files,
  ...folders
}

