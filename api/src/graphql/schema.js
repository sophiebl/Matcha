import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { withFilter } from 'apollo-server';
import fs, { exists } from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import crypto from 'crypto';
import dotenv from 'dotenv';
import deg2rad from 'deg2rad';

dotenv.config();

async function sendNotif(ctx, uid, type, title, message, context) {
	context = context ? context : "";
	ctx.pubsub.publish('RECEIVED_NOTIFICATION', { uid, type, title, message, context });
	ctx.driver.session().run(`MATCH (user:User {uid: $uid}) MERGE (user)-[r:HAS_NOTIF]->(notif:Notification {uid: 'notif-' + $uniqid, type: $type, title: $title, message: $message}) RETURN "Ok"`, { uid, uniqid: ctx.cypherParams.uniqid, type, title, message });
}

function getDistanceBetweenUsers(latMe, longMe, latUser, longUser) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(latUser - latMe); // deg2rad below
	var dLon = deg2rad(longUser - longMe);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(latMe)) *
		Math.cos(deg2rad(latUser)) *
		Math.sin(dLon / 2) *
		Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

async function filter(arr, callback) {
	const fail = Symbol();
	return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail);
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

		async getConv(_, { uid }, ctx) {
			return await ctx.driver.session().run(`MATCH (member:User)-[:HAS_CONV]->(conv:Conversation {uid: $uid}) RETURN member, conv`, { uid })
				.then(async result => {
					const record = result.records[0];
					const conv = record.get('conv').properties;

					let members = new Set();
					result.records.forEach(record => members.add(record.get('member').properties));
					members = Array.from(members);

					return await ctx.driver.session().run(`MATCH (conv:Conversation {uid: $uid})-[:HAS_MSG]->(msg:Message)<-[:AUTHORED]-(author:User) RETURN msg, author ORDER BY msg.uid`, { uid })
						.then(result => {
							let messages = new Set();
							result.records.forEach(record => messages.add({ ...record.get('msg').properties, author: { ...record.get('author').properties, avatar: "", isConnected: true } }));
							messages = Array.from(messages);

							return { uid, members, messages };
						});
				});
		},

		async getMatchingUsers(_, { offset = 0, ageMin, ageMax, distance, elo }, ctx) {
			const meUid = ctx.cypherParams.currentUserUid;

			let prefAgeMin = null, prefAgeMax = null, prefDistance = null, prefElo = null;
			if (ageMin !== null && ageMin !== undefined)
				prefAgeMin = ageMin;
			if (ageMax !== null && ageMax !== undefined)
				prefAgeMax = ageMax;
			if (distance !== null && distance !== undefined)
				prefDistance = distance;
			if (elo !== null && elo !== undefined)
				prefElo = elo;

			const query = `
MATCH (me:User {uid: $meUid})-[:HAS_TAG]->(tag:Tag)<-[:HAS_TAG]-(user:User)
WHERE NOT user.uid = me.uid
AND user.confirmToken = "true"
AND (user.gender = me.prefOrientation OR user.gender = "non-binaire" OR me.prefOrientation = "peu-importe")
AND (user.elo >= ($prefElo - 50) AND user.elo <= ($prefElo + 50))
RETURN DISTINCT user, me SKIP $offset LIMIT 9
`
.replace(/\$prefElo/g, (prefElo === null ? 'me.elo' : '$prefElo'))

console.log(query);

			return await ctx.driver.session().run(query, { meUid, offset, /*prefAge,*/ prefElo })
				.then(async result => {
					const records = await filter(result.records, async record => {
						const me   = record.get('me').properties;
						const user = record.get('user').properties;

						if ((await ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[r:BLOCKED]->(user:User {uid: $userUid}) RETURN count(r) AS blocked`, { meUid, userUid: user.uid })).records[0].get('blocked').low > 0)
						{
							console.log('tej ' + user.username + ' (blocked)');
							return false;
						}
						const dist = getDistanceBetweenUsers(me.lat, me.long, user.lat, user.long);
						console.log((dist <= me.prefDistance ? 'keep ' + user.username : 'tej ' + user.username), '(' + Math.round(dist) + ' km)');
						return dist <= prefDistance;
					});

					return await records.map(async record => {
						const recordUser = record.get('user').properties;
						return (await ctx.driver.session().run(`MATCH (tag:Tag)<-[:HAS_TAG]-(user:User {uid: $uid})-[:HAS_IMG]->(image:Image), (user)-[:LIKED]->(liked:User) RETURN collect(DISTINCT image) AS images, collect(DISTINCT tag) as tags, collect(DISTINCT liked) as likeds`, { uid: recordUser.uid })
							.then(async result => {
								const images     = result.records[0].get('images').map(node => node.properties);
								const tags       = result.records[0].get('tags').map(node => node.properties);
								const likeds     = result.records[0].get('likeds').map(node => node.properties);
								const likesCount = (await ctx.driver.session().run(`MATCH (:User)-[r:LIKED]->(user:User {uid: $uid}) RETURN count(r) AS likesCount`, { uid: recordUser.uid }).then(result => result.records[0].get('likesCount').low));
								const user = {
									...recordUser,
									images: images,
									avatar: images[0].src,
									likesCount: likesCount,
									tags: tags,
									likedUsers: likeds,
									email: null,
									password: null,
									confirmToken: null,
									resetToken: null
								};
								return user;
							}));
					});
				});
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

		async signup (_, { firstname, lastname, username, email, password, lat, long, location, birthdate}, context) {
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
			// console.log(context);
			context.mailtransport.sendMail(mailOptions, (error, info) => {
				if (error) console.log(error);
				else console.log('Email sent: ' + info.response);
			});

			return await context.driver.session().run(`CREATE (u:User {uid: $uid, firstname: $firstname, lastname: $lastname, birthdate: $birthdate, username: $username, email: $email, birthdate: $birthdate, password: $hash, confirmToken: $confirmToken, lat: $lat, long: $long, location: $location})-[:HAS_IMG]->(i:Image {uid: 'img-' + $uniqid, src: "https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown2-512.png"}) RETURN u`,
				{uid, firstname, lastname, username, email, hash, confirmToken, lat, long, location, birthdate, uniqid:context.cypherParams.uniqid})
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

		async emailVerif(_, { confirmToken }, ctx) {
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
							const blocked = await ctx.driver.session().run(`MATCH (target:User {uid: $memberUid})-[b:BLOCKED]->(me:User {uid: $meUid}) RETURN b`, { meUid: me.uid, memberUid: uid }).then(async result => result.records.length > 0);
							if (result.records.length > 0) {
								if (blocked) {
									return new Error("Blocked user");
								} else {
									sendNotif(ctx, target.uid, 'success', "IT'S A MATCH", "Vous avez match avec " + me.username + " !");
									sendNotif(ctx, me.uid, 'success', "IT'S A MATCH", "Vous avez match avec " + target.username + " !");
								}

								return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[:HAS_CONV]->(conv:Conversation)<-[:HAS_CONV]-(target:User {uid: $uid}) RETURN conv`, { meUid, uid })
									.then(async result => {
										if (result.records.length < 1)
											ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (target:User {uid: $uid}) WHERE NOT me = target MERGE (me)-[:HAS_CONV]->(c:Conversation {uid: 'conv-' + $uniqid})<-[:HAS_CONV]-(target) RETURN me, target`, { meUid, uid, uniqid: ctx.cypherParams.uniqid });
										ctx.driver.session().run(`MATCH (me:User {uid: $meUid})-[r:DISLIKED]->(target:User {uid: $uid}) DELETE r`, { meUid, uid });
										return target.uid;
									});
							}
							else {
								if (blocked) {
									return new Error("Blocked user");
								} else {
									sendNotif(ctx, uid, 'default', 'Nouveau like', me.username + " vient de vous liker !");
								}
							}
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
					if (heLiked && iLiked) {
						const blocked = await ctx.driver.session().run(`MATCH (target:User {uid: $memberUid})-[b:BLOCKED]->(me:User {uid: $meUid}) RETURN b`, { meUid: me.uid, memberUid: uid }).then(async result => result.records.length > 0);
						if (blocked) {
							return new Error("Blocked user");
						} else {
							sendNotif(ctx, uid, 'danger', "U GOT UNMATCHED NOOB", me.username + " ne vous like plus :c");
						}
					}
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

		async sendMessage(_, { convUid, message }, ctx) {
			const meUid = ctx.cypherParams.currentUserUid;
			return await ctx.driver.session().run(`MATCH (me:User {uid: $meUid}), (conv:Conversation {uid: $convUid}) CREATE (conv)-[:HAS_MSG]->(msg:Message {uid: 'msg-' + $uniqid, content: $message})<-[:AUTHORED]-(me) RETURN me, msg`, { meUid, convUid, message, uniqid: ctx.cypherParams.uniqid })
				.then(async result => {
					if (result.records.length < 1)
						return null;
					const me  = result.records[0].get('me').properties;
					const msg = result.records[0].get('msg').properties;
					return await ctx.driver.session().run(`MATCH (member:User)-[:HAS_CONV]->(conv:Conversation {uid: $convUid}) RETURN member`, { convUid })
						.then(async result => {
							if (result.records.length < 1)
								return null;
							let members = new Set();
							result.records.forEach(record => {
								const member = record.get('member').properties;
								if (member.uid !== meUid)
									members.add(member);
							});
							Array.from(members).forEach(async member => {
								const blocked = (await ctx.driver.session().run(`MATCH (target:User {uid: $memberUid})-[b:BLOCKED]->(me:User {uid: $meUid}) RETURN b`, { meUid: ctx.cypherParams.currentUserUid, memberUid: member.uid }).then(async result => result.records.length > 0));
								ctx.pubsub.publish('NEW_MESSAGE', { ...msg, author: { ...me, avatar: "", isConnected: true } });
								if (blocked) {
									return new Error("Blocked user");
								} else {
									sendNotif(ctx, member.uid, 'default', 'Nouveau message', message, convUid);
								}
							});
							return message;
						});
					return message;
				});
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
					context.driver.session().run(`MATCH (u:User {uid: $currentUid}) SET u.lastVisite = $date RETURN u`, { currentUid: context.currentUserUid, date});

					return context.pubsub.asyncIterator('');
				},
				(payload, variables) => true,
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
				(_, variables, context) => (context.currentUserUid === variables.uid ? context.pubsub.asyncIterator('RECEIVED_NOTIFICATION') : context.pubsub.asyncIterator('BRUH')),
				(payload, variables) => payload.uid === variables.uid,
			),
			resolve: (payload) => payload,
		},

		newMessage: {
			subscribe: withFilter(
				(_, variables, context) => context.pubsub.asyncIterator('NEW_MESSAGE'),
				(payload, variables) => true//payload.uid === variables.uid,
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
