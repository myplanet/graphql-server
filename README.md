# IA-Phase-2

## Requirements

- node 12.16.*
- redis server running locally

## Setup

- `npm install`
- add a `.env` file to root of the project.  Example env file provided with example fields.
- `npm run start:dev` for local development.

## Deployment

- Current deployment is on Heroku.  Heroku should have redis add-on configured.

## Generator

This project makes use of the (Hygen Generator)[http://www.hygen.io/].  All generator templates are stored in `_templates`.  Please install hygen globally on your system, or make use of `npx`.

The generator can be used to generate an entire module or sub-components of a module.  It should be noted here with emphasis that the generator does not generate the underlying data model in prisma.  The data model, located in `database/datamodel.prisma` will need to be manually updated with the correct data model

`npx hygen module new user` will generate a new module called 'user' in the module folder, with example queries, mutations and subscriptions of the core pattern.

`npx hygen module new:service user` will add a service folder to a module, populated with all the files needed for a service.  Due to autoloading in the root module, the service will be immediately accesible on the context object inside resolvers.

More generators will be added to make it simple to add CRUD methods onto modules, and also possibly to support relations.

## Notes

- Components might be better only associated with a client rather than limited to a single site.  Or they need a higher level organization system, such as a design library or similar.
- might need to better parse identifiers to remove spaces across the application (helper functions)