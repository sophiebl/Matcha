import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { withFilter } from 'apollo-server';
import fs, { exists } from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function sendNotif(ctx, uid, type, title, message) {
	ctx.pubsub.publish('RECEIVED_NOTIFICATION', { uid, type, title, message });
	ctx.driver.session().run(`MATCH (user:User {uid: $uid}) MERGE (user)-[r:HAS_NOTIF]->(notif:Notification {uid: 'notif-' + $uniqid, type: $type, title: $title, message: $message}) RETURN "Ok"`, { uid, uniqid: ctx.cypherParams.uniqid, type, title, message });
}

const resolvers = {
	Query: {
		async getReportedUsers(_, args, ctx) {
			if (true || ctx.cypherParams.currentUserUid.startsWith('admin-'))
			{
				return await ctx.driver.session().run(`MATCH (reporter:User)-[r:REPORTED]->(reported:User) WHERE reported.banned IS NULL RETURN reported`)
					.then(result => {
						if (result.records.length < 1)
							return null;
						let reportedUsers = new Set();
						result.records.forEach(record => reportedUsers.add(record.get('reported').properties));
						return Array.from(reportedUsers);	
					});
			}
			else return new Error('NotAdmin');
		},
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
		},

		async notifications(_, args, ctx) {
			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[:HAS_NOTIF]->(notifs:Notification) RETURN notifs`, { meUid: ctx.cypherParams.currentUserUid })
				.then(result => {
					if (result.records.length < 1)
						return null;
					let notifs = [];
					result.records.forEach(record => notifs.push(record.get('notifs').properties));
					ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[rels:HAS_NOTIF]->(notifs:Notification) DELETE rels, notifs`, { meUid: ctx.cypherParams.currentUserUid });
					return notifs;	
				});
		},
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
						return new Error('CouldNotCreateUser')
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
							return new Error('UnknownUser')
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
						return new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});
		},

		async resetPassword(_, { password, resetToken }) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await ctx.driver.session().run(`MATCH (u:User {resetToken: $resetToken}) SET u.password = $hash RETURN u`, { resetToken, hash })
				.then(result => {
					if (result.records.length < 1)
						return new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1y' });
				});
		},
		
		async login (_, { username, password, lat, long, location }, ctx) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await ctx.driver.session().run(`MATCH (u:User) WHERE toLower(u.username) = toLower($username) SET u.lat = $lat SET u.long = $long SET u.location = $location RETURN u`, { username, long, lat, location })
				.then(result => {
					if (result.records.length < 1)
						return new Error('UnknownUsername');
					const user = result.records[0].get('u').properties;
					if (hash !== user.password)
						return new Error('InvalidPassword');
					if (user.confirmToken != 'true')
						return new Error('EmailNotConfirmed');
					if (user.banned == true)
						return new Error('UserBanned');
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
				console.log('publis disco (logout)');
			}

			return "Ok";
		},

		async reportUser(_, { uid }, ctx) {
			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) MERGE (me)-[:REPORTED]->(target) WITH me, target MATCH (:User)-[r:REPORTED]->(target) RETURN COUNT(r) as reportsCount`, { meUid: ctx.cypherParams.currentUserUid, uid })
				.then(async result => {
					if (result.records.length < 1)
						return new Error('UnknownUser')
					const reportsCount = result.records[0].get('reportsCount').low;
					if (reportsCount >= 5)
						await ctx.driver.session().run(`MATCH (target:User {uid: $uid}) SET target.banned = true`, { uid })
					return reportsCount;
				});	
		},

		async likeUser(_, { uid }, ctx) {
			const meUid = ctx.cypherParams.currentUserUid;
			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) WHERE NOT me = target MERGE (me)-[:LIKED]->(target) RETURN me, target`, { meUid, uid })
				.then(async result => {
					const me = result.records[0].get('me').properties;
					const target = result.records[0].get('target').properties;
					return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid})<-[r:LIKED]-(target:User {uid: $uid}) RETURN r`, { meUid, uid })
						.then(async result => {
							if (result.records.length > 0) {
								sendNotif(ctx, target.uid, 'success', "IT'S A MATCH", "Vous avez match avec " + me.username + " !");
								sendNotif(ctx, me.uid, 'success', "IT'S A MATCH", "Vous avez match avec " + target.username + " !");
							}
							else
								sendNotif(ctx, uid, 'default', 'Nouveau like', target.username + " vient de vous liker !");
							ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[r:DISLIKED]->(target:User {uid: $uid}) DELETE r`, { meUid, uid });
							return target.uid;
						});
				});
		},

		async dislikeUser(_, { uid }, ctx) {
			const meUid = ctx.cypherParams.currentUserUid;

			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) WHERE NOT me = target MERGE (me)-[:DISLIKED]->(target) RETURN me, target `, { meUid, uid })
				.then(async result => {
					if (result.records.length < 1)
						return new Error('UnknownUser')
					const target = result.records[0].get('target').properties;
					const me = result.records[0].get('me').properties;
					const heLiked = await ctx.driver.session().run(`MATCH (me:User {uid: $meUid})<-[r:LIKED]-(target:User {uid: $uid}) RETURN r`, { meUid, uid })
						.then(async result => result.records.length > 0);
					const iLiked = await ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[r:LIKED]->(target:User {uid: $uid}) RETURN r`, { meUid, uid })
						.then(async result => result.records.length > 0);
					if (heLiked && iLiked)
						sendNotif(ctx, uid, 'danger', "U GOT UNMATCHED NOOB", me.username + " ne vous like plus :c");
					ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[r:LIKED]->(target:User {uid: $uid}) DELETE r`, { meUid, uid });
					return target.uid;
				});
		},

		async visitProfile(_, { uid }, ctx) {
			const meUid = ctx.cypherParams.currentUserUid;
			if (uid === meUid)
				return null;
			//return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) WHERE NOT me = target MERGE (me)-[:VISITED]->(target) RETURN me, target`, { meUid, uid })
			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) WHERE NOT me = target AND NOT (me)-[:VISITED]->(target) MERGE (me)-[:VISITED]->(target) RETURN me, target`, { meUid, uid })
				.then(async result => {
					if (result.records.length < 1)
						return null;
					const me     = result.records[0].get('me').properties;
					const target = result.records[0].get('target').properties;
					sendNotif(ctx, target.uid, 'default', 'Profil visite', me.username + " vient de voir votre profil !");
					return target;
				});
		},

		async banUser(_, { uid }, ctx) {
			if (true || ctx.cypherParams.currentUserUid.startsWith('admin-'))
			{
				ctx.driver.session().run(`MATCH (user:User {uid: $uid}) SET user.banned = true`, { uid });
				return "Ok";
			}
			else return new Error('NotAdmin');
		},

	},

	Subscription: {
		connect: {
			subscribe: withFilter(
				(_, variables, context) => {
					const uid = jwt.verify(context.token, process.env.JWT_SECRET, (err, decoded) => (decoded ? decoded.uid : null));
					if (!context.connectedUsers.includes(uid))
					{
						context.connectedUsers.push(uid);
						context.pubsub.publish('USER_STATE_CHANGED', { user: { uid: uid }, state: 1 });
					}

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

		receivedNotification: {
			subscribe: withFilter(
				(_, variables, context) => (context.currentUserUid === variables.uid ? context.pubsub.asyncIterator('RECEIVED_NOTIFICATION') : false),
				(payload, variables) => payload.uid === variables.uid,
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
