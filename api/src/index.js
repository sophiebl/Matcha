import schema  from './graphql/schema.js';
import { v1 as neo4j }  from 'neo4j-driver';
import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import dotenv from 'dotenv'

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
		onConnect: (connectionParams, webSocket, context) => {
			console.log(`Subscription client connected using Apollo server's built-in SubscriptionServer.`);
			console.log(connectionParams);
			return {
				headers: {
					Authorization: `Bearer ${connectionParams.token}`,
				},
			}
		},
		onDisconnect: async (webSocket, context) => {
			console.log(`Subscription client disconnected.`);
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
