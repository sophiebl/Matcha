import { makeAugmentedSchema } from 'neo4j-graphql-js';
import fs, { exists } from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

//import crypto from 'crypto-js/core'
//import PBKDF2 from 'crypto-js/pbkdf2'
import SHA256 from 'crypto-js/sha256'

import { v1 as neo4j }  from 'neo4j-driver';
const driver = neo4j.driver('bolt://db', neo4j.auth.basic('neo4j', 'matcha'))
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
	Query: {
		
  },

  Mutation: {
	async signup (_, { firstname, lastname, username, email, password }) {
		const uid = uniqid('user-');
		//const hash = await PBKDF2(password, 'salt', { iterations: 10, hasher: crypto.algo.SHA256, keySize: 256 }).toString();
		const hash = await SHA256(password, 'salt').toString();
		const emailToken = Math.random() * 10;
		const url = `http://localhost:3000/verification/${emailToken}/${uid}`;

		
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

		return await session.run(`CREATE (u:User {uid: $uid, firstname: $firstname, lastname: $lastname, username: $username, email: $email, password: $hash, confirmToken: $emailToken}) RETURN u`,
		{uid, firstname, lastname, username, email, hash, emailToken})
		.then(result => {
			const user = result.records[0].get('u').properties;
			return jwt.sign(
				{ uid: user.uid },
				process.env.JWT_SECRET,
				{ expiresIn: '1y' }
			)
		});
	},
	async emailverif(_, { uid, confirmToken }) {
		if (confirmToken != "true")
		{
			confirmToken = "true";
			return await session.run(`MATCH (u:User {uid: $uid}) SET u.confirmToken = 'true' RETURN u`,
			{uid})
			.then(result => {
				const user = result.records[0].get('u').properties;
				console.log("user");
				console.log(user);
				return jwt.sign(
					{ uid: user.uid },
					process.env.JWT_SECRET,
					{ expiresIn: '1y' }
				)
			});
		}
	}, 
	async pwdReset(_, { email }) {
	/*	console.log('email');
		console.log(email);
		const uid = uniqid('user-');
		//const hash = await PBKDF2(password, 'salt', { iterations: 10, hasher: crypto.algo.SHA256, keySize: 256 }).toString();
//		const hash = await SHA256(password, 'salt').toString();
		const pwdToken = Math.random() * 10;
		const url = `http://localhost:3000/verification/${pwdToken}`;

		const sendmail = require('sendmail')();
		
		sendmail({
		  from: 'sophieboulaaouli@gmail.com',
		  to: email,
		  subject: 'Forgot password',
		  html: `Click here to reset your password : <a href="${url}">${url}</a>`,
		}, function(err, reply) {
		  console.log(err && err.stack);
		  console.dir(reply);
		});*/
		console.log('before querie');

		return await session.run(`MATCH (u:User {email: $email, confirmToken: 'true'}) RETURN u`,
		{email})
		.then(result => {
			const user = result.records[0].get('u').properties;
			console.log(user);
			if (!user) {
				throw new Error('No user with that email')
			}
			return jwt.sign(
				{ uid: user.uid },
				process.env.JWT_SECRET,
				{ expiresIn: '1y' }
			)
		});
	}, 
	async login (_, { username, password }) {
		// return await session.run(`MATCH (u:User {username: $username, confirmToken: 'true'}) RETURN u`,
		const hash = await SHA256(password, 'salt').toString();
		return await session.run(`MATCH (u:User) WHERE toLower(u.username) = toLower($username) RETURN u`,
			{username})
			.then(result => {
				const user = result.records[0].get('u').properties;
				if (!user) {
					throw new Error('No user with that username')
				}
				if (hash !== user.password)
					throw new Error('Incorrect password')
			  	return jwt.sign(
					{ uid: user.uid },
					process.env.JWT_SECRET,
					{ expiresIn: '1d' }
				)
			});	
		}
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
