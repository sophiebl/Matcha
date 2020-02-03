import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { withFilter } from 'apollo-server';
import fs, { exists } from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const resolvers = {
	Query: {

	},

	User: {
		async elo({ uid	}, args, ctx) {
			return await ctx.driver.session().run(`MATCH (:User)-[r:VISITED|LIKED|DISLIKED|BLOCKED|REPORTED]->(user:User {uid: $uid}) RETURN TYPE(r) AS type, COUNT(r) AS amount ORDER BY amount DESC`, { uid })
				.then(result => {
					const stats = {};
					result.records.forEach(record => stats[record.get('type')] = record.get('amount').low);
					let elo = ((stats.LIKED || 0) / (stats.VISITED || 0)) + ((stats.LIKED || 0) - (stats.DISLIKED || 0)) - (((stats.BLOCKED ||0) + (stats.REPORTED || 0)) * 0.01);
					elo = (elo == Infinity || elo == NaN || elo == undefined) ? 0 : elo;
					const numberToString = number => Number.isInteger(elo) ? (elo + '.0') : elo.toString();
					const removeDot = string => string.replace('.', '');
					//console.log(removeDot(numberToString(elo)) || 0);
					return 42;
					//return removeDot(numberToString(elo)) || 0;
				});
		},

		async isConnected({ uid }, args, ctx) {
			//console.log("context dans isConnected:", ctx);
			return ctx.connectedUsers.includes(uid);
		}
	},

	Mutation: {
		async signup (_, { firstname, lastname, username, email, password, lat, long, location}, context) {
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
			//console.log(ctx);
			console.log(context);
			context.mailtransport.sendMail(mailOptions, (error, info) => {
				if (error) console.log(error);
				else console.log('Email sent: ' + info.response);
			});

			return await context.driver.session().run(`CREATE (u:User {uid: $uid, firstname: $firstname, lastname: $lastname, username: $username, email: $email, birthdate: 'null', password: $hash, confirmToken: $confirmToken, lat: $lat, long: $long, location: $location})-[:HAS_IMG]->(i:Image {uid: 'img-' + $uniqid, src: "https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown2-512.png"}) RETURN u`,
				{uid, firstname, lastname, username, email, hash, confirmToken, lat, long, location, uniqid:context.cypherParams.uniqid})
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
				return await ctx.driver.session().run(`MATCH (u:User {confirmToken: $confirmToken}) SET u.confirmToken = 'true' RETURN u`, { confirmToken })
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

			return await ctx.driver.session().run(`MATCH (u:User {email: $email}) SET u.resetToken = $resetToken RETURN u`, { email, resetToken })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});
		},

		async resetPassword(_, { password, resetToken }) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await ctx.driver.session().run(`MATCH (u:User {resetToken: $resetToken}) SET u.password = $hash RETURN u`, { resetToken, hash })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});
		},
		
		async login (_, { username, password }, ctx) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await ctx.driver.session().run(`MATCH (u:User) WHERE toLower(u.username) = toLower($username) RETURN u`, { username })
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
					//if (!ctx.connectedUsers.includes(user.uid))
					//	ctx.connectedUsers.push(user.uid);
					ctx.pubsub.publish('USER_STATE_CHANGED', { user: user, state: 1 });
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});	
		},

		async logout (_, { }, ctx) {
			const index = ctx.connectedUsers.indexOf(ctx.cypherParams.currentUserUid);
			if (index !== -1)
			{
				ctx.connectedUsers.splice(index, 1);
				console.log('removed from array (logout)');
			}
			if (!ctx.connectedUsers.includes(ctx.cypherParams.currentUserUid))
			{
				ctx.pubsub.publish('USER_STATE_CHANGED', { user: { uid: ctx.cypherParams.currentUserUid }, state: 0 });
			}
			return "Ok";
		},

		async reportUser(_, { uid }, ctx) {
			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) MERGE (me)-[:REPORTED]->(target) WITH me, target MATCH (:User)-[r:REPORTED]->(target) RETURN COUNT(r) as reportsCount`, { meUid: ctx.cypherParams.currentUserUid, uid })
				.then(async result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const reportsCount = result.records[0].get('reportsCount').low;
					if (reportsCount >= 5)
						await ctx.driver.session().run(`MATCH (target:User {uid: $uid}) SET target.banned = true`, { uid })
					return reportsCount;
				});	
		},

	},

	Subscription: {
		connect: {
			subscribe: withFilter(
				(_, variables, context) => {
					const uid = jwt.verify(context.token, process.env.JWT_SECRET, (err, decoded) => (decoded ? decoded.uid : null));
					//if (!context.connectedUsers.includes(uid))
					let date_ob = new Date();
					let day = ("0" + date_ob.getDate()).slice(-2);
					let year = date_ob.getFullYear();
					let hours = date_ob.getHours();
					const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre" ];
					let date = day + " " + monthNames[date_ob.getMonth()] + " " + year + " à " + hours + "h";
					context.driver.session().run(`MATCH (u:User {uid: $currentUid}) SET u.lastVisite = $date RETURN u`, { currentUid: context.currentUserUid, date})
					return context.pubsub.asyncIterator('');
				},
				(payload, variables) => false,
			),
			resolve: (payload) => "Ok",
		},

		userStateChanged: {
			subscribe: withFilter(
				(_, variables, context) => context.pubsub.asyncIterator('USER_STATE_CHANGED'),
				(payload, variables) => payload.user.uid === variables.uid,
			),
			resolve: (payload) => payload,
		},
	},

};

const typeDefs = fs.readFileSync('/usr/src/src/graphql/schema.gql', 'utf8');
const schema = makeAugmentedSchema({
	typeDefs,
	resolvers,
	logger: console,
	config: {
		debug: false,
		auth: {
			isAuthenticated: true,
		},
		query: {
			exclude: ['Subscription', 'UserState'],
		},
		mutation: {
			exclude: ['Subscription', 'UserState'],
		},
	}
});

export default schema;
