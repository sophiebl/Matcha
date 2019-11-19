import { makeAugmentedSchema } from 'neo4j-graphql-js';
import fs, { exists } from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv'
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

const resolvers = {
	/*Query: {
		files: () => {
			// Return the record of files uploaded from your DB or API or filesystem.
		}

	},*/

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
						return jwt.sign(
							{ uid: user.uid },
							process.env.JWT_SECRET,
							{ expiresIn: '1y' }
						)
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
					return jwt.sign(
						{ uid: user.uid },
						process.env.JWT_SECRET,
						{ expiresIn: '1y' }
					)
				});
		},

		async resetPassword(_, { password, resetToken }) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await session.run(`MATCH (u:User {resetToken: $resetToken}) SET u.password = $hash RETURN u`, { resetToken, hash })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUser')
					const user = result.records[0].get('u').properties;
					return jwt.sign(
						{ uid: user.uid },
						process.env.JWT_SECRET,
						{ expiresIn: '1y' }
					)
				});
		},

		async login (_, { username, password }) {
			const hash = crypto.createHmac('sha256', 'matcha').update(password + 'salt').digest('hex');
			return await session.run(`MATCH (u:User) WHERE toLower(u.username) = toLower($username) RETURN u`, { username })
				.then(result => {
					if (result.records.length < 1)
						throw new Error('UnknownUsername')
					const user = result.records[0].get('u').properties;
					if (hash !== user.password)
						throw new Error('InvalidPassword')
					if (user.confirmToken != 'true')
						throw new Error('EmailNotConfirmed')
					return jwt.sign(
						{ uid: user.uid },
						process.env.JWT_SECRET,
						{ expiresIn: '1d' }
					)
				});	
		},
/*
		async uploadImages(parent, { file }) {
			return args.file.then(file => {
			  //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
			  //file.stream is a node stream that contains the contents of the uploaded file
			  //node stream api: https://nodejs.org/api/stream.html
			  return file;
			});
		  },


		async uploadImages(parent, { file }) {
			console.log('stream');
			const { stream, filename, mimetype, encoding } = await file;
	  
			// 1. Validate file metadata.
	  
			// 2. Stream file contents into cloud storage:
			// https://nodejs.org/api/stream.html
			stream = fs.createReadStream("http://localhost:3000/profile");
			console.log(stream);

			stream.on("data", function(data) {
				var chunk = data.toString();
				console.log("debug : "+chunk);
			});

			// 3. Record the file upload in your DB.
			// const id = await recordFile( … )
	  
			return { filename, mimetype, encoding };
		  }
		  */

	}
};

const typeDefs = fs.readFileSync('/usr/src/src/graphql/schema.gql', 'utf8');
const schema = makeAugmentedSchema({
	typeDefs,
	resolvers,
	config: {
		auth: {
			isAuthenticated: true,
		}
	}
});
export default schema
