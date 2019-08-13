const { buildSchema } = require('graphql');

exports.registerSchema = buildSchema(`
    type User {
        name: String
    }

    type Query {
		hello: String,
        user(name: String!): User
        users: [User]
    }
`);
