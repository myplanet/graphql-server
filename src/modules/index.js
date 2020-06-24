/* This file is the primary loader of all modules. It will load up the various file types
  based on glob patterns for their file names. These are as follows:

  *.graphql -       The graphql SDL definitions.  These are then all merged together.
  *.resolvers.js -  The resolvers for each module.  See one of the files for an example
                    of what the standard format for the file is.
  /**\/service -    loads up the service from the folders index.js.  Services are bundles
                    of abstracted files that handle publish/subscribe architecture, queries,
                    mutations, and subscriptions.

  Each module is a discrete feature of the server, and it usually related to a particular
  data model.  I was considering having every module define its own relationships onto 
  other modules, but decided against this eventually as it was too confusing.  It would 
  create extremely reusable flexible modules if all modules only defined their own types 
  and added those types to other modules, but to do that properly would require a much more 
  thorough approach.  However, as it is, each module is rightly bound via the types in the
  SDL to the other modules.
  
  For  production development, I would likely recommend using Graphql Modules alongside 
  typescript. This module system is highly flexible, allow for dependency injection,
  isolated modules, and prommotes testability and reusability.

  However, for this level of proof of concept, a simple module system was chosen which
  promotes rapid development.  All that is require to add a new feature is a graphql schema
  and a resolvers file.  Everything else is autoloaded.
*/

const path = require('path');
const glob = require( 'glob' );
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');


// ██████╗  █████╗ ████████╗ █████╗ ██████╗  █████╗ ███████╗███████╗███████╗
// ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
// ██║  ██║███████║   ██║   ███████║██████╔╝███████║███████╗█████╗  ███████╗
// ██║  ██║██╔══██║   ██║   ██╔══██║██╔══██╗██╔══██║╚════██║██╔══╝  ╚════██║
// ██████╔╝██║  ██║   ██║   ██║  ██║██████╔╝██║  ██║███████║███████╗███████║
// ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝


// Get generated prisma client
const { prisma } = require('./../../database/generated/prisma-client');

// Get redis connect instance from config
const pubsub = require('../connections/redisPubSub');

const connections = {
  prisma,
  pubsub
};

// ████████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗███████╗███████╗
// ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██╔════╝
//    ██║    ╚████╔╝ ██████╔╝█████╗  ██║  ██║█████╗  █████╗  ███████╗
//    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ██║  ██║██╔══╝  ██╔══╝  ╚════██║
//    ██║      ██║   ██║     ███████╗██████╔╝███████╗██║     ███████║
//    ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚═════╝ ╚══════╝╚═╝     ╚══════╝


// go through all modulees and auto-load the data types for easy management.
const typesArray = fileLoader(path.join(__dirname, './**/*.graphql'));
// Generate typedefs
const typeDefs = mergeTypes(typesArray, { all: true });



// ██████╗ ███████╗███████╗ ██████╗ ██╗    ██╗   ██╗███████╗██████╗ ███████╗
// ██╔══██╗██╔════╝██╔════╝██╔═══██╗██║    ██║   ██║██╔════╝██╔══██╗██╔════╝
// ██████╔╝█████╗  ███████╗██║   ██║██║    ██║   ██║█████╗  ██████╔╝███████╗
// ██╔══██╗██╔══╝  ╚════██║██║   ██║██║    ╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║
// ██║  ██║███████╗███████║╚██████╔╝███████╗╚████╔╝ ███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝ ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝    

// Load resolvers based on glob naming convention
const resolversArray = fileLoader(path.join(__dirname, "./**/*.resolvers.*"));

// Generate resolvers
const resolvers = mergeResolvers(resolversArray);


// ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗███████╗
// ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝██╔════╝
// ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  ███████╗
// ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  ╚════██║
// ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗███████║
// ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚══════╝


// Load up all services by reducing the chosen files, requiring them, and 
// passng the prisma instance and the pubsub to the service.
const services = glob.sync( 'src/modules/**/service' ).reduce(function(acc, file) {
  // Services are given access to the pubsub and the prisma instance.

  const service = require(path.resolve( file ))(prisma, pubsub);

  // Get the name to assign to the model based on the file name inside the modules folder.
  const name = file.match(/(?<=src\/modules\/)(.*)(?=\/)/)[0];

  return { ...acc, [name]: service }
}, {});


// this is temporary till we find a better better. It is inelegant requiring it here and just stuffing it onto the service object.
services.workerQueue = () => {
  return require('../workers');
}

// We need to give all modules access to all services.  So each modules service is a higher order function.
// We initialize the servic module twice.  The first round with prisma and pubsub, the second with all of the services.
Object.keys(services).forEach(name => {
  // weird syntax, but just putting all services onto a service for internal usage
  services[name] = services[name](services);
  // add an interface to the service at the root for making raw queries to the prisma server if needed.
  services[name].raw = (query, variables) => {
    return prisma.$graphql(query, variables);
  }
});


// ██╗     ██╗███████╗████████╗███████╗███╗   ██╗███████╗██████╗ ███████╗
// ██║     ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔══██╗██╔════╝
// ██║     ██║███████╗   ██║   █████╗  ██╔██╗ ██║█████╗  ██████╔╝███████╗
// ██║     ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗╚════██║
// ███████╗██║███████║   ██║   ███████╗██║ ╚████║███████╗██║  ██║███████║
// ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝


// Find all event listeners in modules, and load them up with the created event pubsub.
// Also give the pubsub access to the service if it needs it.
glob.sync( './**/*.listeners.js' ).forEach( function( file ) {
  require(path.resolve( file ))(pubsub, services, prisma);
});


// ██████╗ ██╗   ██╗██╗     ███████╗███████╗
// ██╔══██╗██║   ██║██║     ██╔════╝██╔════╝
// ██████╔╝██║   ██║██║     █████╗  ███████╗
// ██╔══██╗██║   ██║██║     ██╔══╝  ╚════██║
// ██║  ██║╚██████╔╝███████╗███████╗███████║
// ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝

// Here we run through and grab any custom rules that might be defined in a module so they can be
// injected into the resolvers at runtime by our permission system.

const rules = glob.sync( './**/*.rules.js' ).reduce((acc, file ) => {
  const moduleRules = require(path.resolve( file ));

  return {...moduleRules, ...acc }
}, {});


// ██████╗ ███████╗██████╗ ███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔══██╗██╔════╝██╔══██╗████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║██╔════╝
// ██████╔╝█████╗  ██████╔╝██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║███████╗
// ██╔═══╝ ██╔══╝  ██╔══██╗██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║╚════██║
// ██║     ███████╗██║  ██║██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║███████║
// ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

// Any custom permissions we might want to add in that do not fit onto the main resolvers
// such as type wide permissions.  Because our permissions are dependent on rules collected
// from a variety of sources, we will inject the rules here, and then run through and 
// generate all the permissions.

const createPermissions = rules => {
  return glob.sync( './**/*.permissions.js' ).reduce((acc, file ) => {
    const permissions = require(path.resolve( file ))(rules);
  
    return {...permissions, ...acc }
  }, {});
}

module.exports = {
  typeDefs,
  resolvers,
  services,
  rules,
  createPermissions,
  // these are exported for possbile lower level access in resolvers.
  prisma,
  pubsub,
}