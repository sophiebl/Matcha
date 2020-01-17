import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { PubSub, withFilter } from 'apollo-server';
import fs, { exists } from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config()

import { v1 as neo4j }  from 'neo4j-driver';
const driver = neo4j.driver('bolt://db', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));
const session = driver.session();

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secureConnection: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

const pubsub = new PubSub();

const resolvers = {
	Query: {

	},

	User: {
		async elo(obj, args, ctx) {
			return await session.run(`MATCH (:User)-[r:VISITED|LIKED|DISLIKED|BLOCKED|REPORTED]->(user:User {uid: $uid}) RETURN TYPE(r) AS type, COUNT(r) AS amount ORDER BY amount DESC`, { uid: obj.uid })
				.then(result => {
					const stats = {};
					result.records.forEach(record => stats[record.get('type')] = record.get('amount').low);
					let elo = ((stats.LIKED || 0) / (stats.VISITED || 0)) + ((stats.LIKED || 0) - (stats.DISLIKED || 0)) - (((stats.BLOCKED ||0) + (stats.REPORTED || 0)) * 0.01);
					elo = (elo == Infinity) ? 0 : elo;
					const numberToString = number => Number.isInteger(elo) ? (elo + '.0') : elo.toString();
					const removeDot = string => string.replace('.', '');
					return removeDot(numberToString(elo));
				});
		}
	},

	Mutation: {
		async signup (_, { firstname, lastname, username, email, password }) {
			const uid = uniqid('user-');
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			const confirmToken = uniqid() + crypto.randomBytes(16).toString('hex');
			const url = `http://localhost:3000/confirm/${confirmToken}`;

			var mailOptions = {
				from: process.env.MAIL_USER,
				to: email,
				subject: 'Matcha | Confirm your account',
				text: `Click here to confirm your email : ${url}`,
				html: `Click here to confirm your email : <a href="${url}">${url}</a>`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) console.log(error);
				else console.log('Email sent: ' + info.response);
			});

			return await session.run(`CREATE (u:User {uid: $uid, firstname: $firstname, lastname: $lastname, username: $username, email: $email, password: $hash, confirmToken: $confirmToken}) RETURN u`,
				{uid, firstname, lastname, username, email, hash, confirmToken})
				.then(result => {
					if (result.records.length < 1)
						throw new Error('CouldNotCreateUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign(
						{ uid: user.uid },
						process.env.JWT_SECRET,
						{ expiresIn: '1y' }
					)
				});
		},

		async emailVerif(_, { confirmToken }) {
			if (confirmToken !== 'true')
			{
				return await session.run(`MATCH (u:User {confirmToken: $confirmToken}) SET u.confirmToken = 'true' RETURN u`, { confirmToken })
					.then(result => {
						if (result.records.length < 1)
							throw new Error('UnknownUser')
						const user = result.records[0].get('u').properties;
						return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
					});
			}
		},

		async sendPwdReset(_, { email }) {
			const resetToken = uniqid() + crypto.randomBytes(16).toString('hex');
			const url = `http://localhost:3000/reset/${resetToken}`;

			var mailOptions = {
				from: process.env.MAIL_USER,
				to: email,
				subject: 'Matcha | Reset your password',
				text: `Click here to reset your password : ${url}`,
				html: `Click here to reset your password : <a href="${url}">${url}</a>`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) console.log(error);
				else console.log('Email sent: ' + info.response);
			});

			return await session.run(`MATCH (u:User {email: $email}) SET u.resetToken = $resetToken RETURN u`, { email, resetToken })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});
		},

		async resetPassword(_, { password, resetToken }) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await session.run(`MATCH (u:User {resetToken: $resetToken}) SET u.password = $hash RETURN u`, { resetToken, hash })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});
		},

		async login (_, { username, password }) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await session.run(`MATCH (u:User) WHERE toLower(u.username) = toLower($username) RETURN u`, { username })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUsername');
					const user = result.records[0].get('u').properties;
					if (hash !== user.password)
						throw new Error('InvalidPassword');
					if (user.confirmToken != 'true')
						throw new Error('EmailNotConfirmed');
					if (user.banned == true)
						throw new Error('UserBanned');
					pubsub.publish('USER_CONNECTED', user);
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});	
		},

		async reportUser(_, { uid }, ctx) {
			return await session.run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) MERGE (me)-[:REPORTED]->(target) WITH me, target MATCH (:User)-[r:REPORTED]->(target) RETURN COUNT(r) as reportsCount`, { meUid: ctx.cypherParams.currentUserUid, uid })
				.then(async result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const reportsCount = result.records[0].get('reportsCount').low;
					if (reportsCount >= 5)
						await session.run(`MATCH (target:User {uid: $uid}) SET target.banned = true`, { uid })
					return reportsCount;
				});	
		},

	},

	Subscription: {
		userConnected: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('USER_CONNECTED'),
				(payload, variables) => payload.uid === variables.uid,
			),
			resolve: (user) => user,
		}
	},

};

const typeDefs = fs.readFileSync('/usr/src/src/graphql/schema.gql', 'utf8');
const schema = makeAugmentedSchema({
	typeDefs,
	resolvers,
	config: {
		auth: {
			isAuthenticated: true,
		},
		query: {
			exclude: ['Subscription'],
		},
		mutation: {
			exclude: ['Subscription'],
		},
	}
});

export default schema;
