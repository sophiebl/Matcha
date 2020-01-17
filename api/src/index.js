import schema  from './graphql/schema.js';
import { v1 as neo4j }  from 'neo4j-driver';
import { ApolloServer, PubSub } from 'apollo-server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import uniqid from 'uniqid';
import dotenv from 'dotenv'

dotenv.config()

const driver = neo4j.driver('bolt://db:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));

var corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};

const mailtransport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secureConnection: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

const pubsub = new PubSub();

const apolloServer = new ApolloServer({
	schema,
	cors: corsOptions,
	context: ({ req, connection }) => connection ? ({...connection.context, pubsub}) : ({
		driver,
		pubsub,
		req,
		mailtransport,
		headers: req.headers,
		token: (req.headers.authorization && req.headers.authorization.slice(7)) || '',
		cypherParams: {
			currentUserUid: jwt.verify((req.headers.authorization && req.headers.authorization.slice(7)), process.env.JWT_SECRET, function(err, decoded) {
				if (!decoded)
					return null;
				return decoded.uid;
			}),
			uniqid: uniqid(),
		},
	}),
	subscriptions: {
		onConnect: (connectionParams, webSocket, context) => {
			console.log(`Subscription client connected.`);
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
