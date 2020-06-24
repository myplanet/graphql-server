---
to: src/modules/<%= name %>/<%= name %>.graphql
unless_exists: true
---
type <%= Name %> {
    id: ID!
    updatedAt: DateTime
    createdAt: DateTime
}

input <%= Name %>WhereInput {
    id: ID
}

input <%= Name %>CreateInput {
    #example property
    name: String
}

type Query {
    <%= name %>(id: ID!): <%= Name %>
}

type Mutation {
    <%= name %>Create(data: <%= Name %>CreateInput): <%= Name %>
}

type Subscription {
    <%= name %>Create:  <%= Name %>
}