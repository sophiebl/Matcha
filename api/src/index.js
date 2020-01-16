import schema  from './graphql/schema.js';
import { v1 as neo4j }  from 'neo4j-driver';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';

dotenv.config()

const driver = neo4j.driver('bolt://db:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));

var corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};

const apolloServer = new ApolloServer({
	schema,
	cors: corsOptions,
	context: ({ req, connection }) => connection ? (connection.context) : ({
		driver,
		req,
		headers: req.headers,
		token: (req.headers.authorization && req.headers.authorization.slice(7)) || '',
		cypherParams: {
			currentUserUid: jwt.verify((req.headers.authorization && req.headers.authorization.slice(7)), process.env.JWT_SECRET, function(err, decoded) {
				if (!decoded)
					return null;
				return decoded.uid;
			}),
			uniqid: uniqid(),
		}
	}),
	subscriptions: {
		onConnect: (connectionParams, webSocket) => {
			return {
				headers: {
					Authorization: `Bearer ${connectionParams.Authorization.split(' ')[1]}`,
				},
			}
		},
	},
	playground: {
		settings: {
			'request.credentials': 'include',
		},
	},
});

apolloServer.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`🚀 Server ready at ${url}`);
	console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
