const { buildSchema } = require('graphql');

exports.registerSchema = buildSchema(`
    type User {
		id: Int!
        name: String!
    }

    type Query {
		user(name: String!): User
		users(first: Int, last: Int): [User]
    }
`);
