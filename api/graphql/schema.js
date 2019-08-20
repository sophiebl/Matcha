// Auto
import ngj from 'neo4j-graphql-js';

const typeDefs = `
type User {
	id: Int!
	firstname: String
	lastname: String
	email: String
	birthdate: String
	gender: String
	bio: String
	tags: [Tag] @relation(name: "ENJOYS", direction: "OUT")
	elo: Int
	prefAge: Int
	prefOrientation: String
	prefRadius: Int
	confirmToken: String
	resetToken: String
	likesCount: Int
	likedUsers: [User] @relation(name: "LIKED", direction: "OUT")
	likedByUsers: [User] @relation(name: "LIKED", direction: "IN")
}

type Tag {
	id: Int!
	name: String!
}

type Query {
  Users: [User]
}
`;

const schema = ngj.makeAugmentedSchema({ typeDefs });
export default schema

// Manual
/*
const { buildSchema } = require('graphql');
exports.registerSchema = buildSchema(`
    type User {
		id: Int!
        firstname: String!
		lastname: String!
		email: String!
		birthdate: String!
		gender: String!
		bio: String!
#		tags: [Tag]
#		images: String
		elo: Int!
		prefAge: Int!
		prefOrientation: String!
		prefRadius: Int!
		confirmToken: String!
		resetToken: String!
		likesCount: Int!
    }

    type Query {
		user(id: Int, firstname: String): User
		users(first: Int, last: Int): [User]
    }
`);
*/
