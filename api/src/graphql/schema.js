import { makeAugmentedSchema } from 'neo4j-graphql-js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';

import crypto from 'crypto-js/core'
import PBKDF2 from 'crypto-js/pbkdf2'
import SHA256 from 'crypto-js/sha256'

import { v1 as neo4j }  from 'neo4j-driver';
const driver = neo4j.driver('bolt://db', neo4j.auth.basic('neo4j', 'matcha'))
const session = driver.session();

const resolvers = {
  Mutation: {
	async signup (_, { firstname, email, password }) {
	  const id = uniqid('user-');

	  //const hash = await PBKDF2(password, 'salt', { iterations: 10, hasher: crypto.algo.SHA256, keySize: 256 }).toString();
	  const hash = await SHA256(password, 'salt').toString();

	  return await session.run(`CREATE (u:User {id: $id, firstname: $firstname, email: $email, password: $hash}) RETURN u`,
		{id, firstname, email, hash})
		.then(result => {
		  const user = result.records[0].get('u').properties;
		  //console.log(user);
		  return jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1y' }
		  )
		});
	},

	async login (_, { email, password }) {
	  //const user = await User.findOne({ where: { email } })

	  if (!user) {
		throw new Error('No user with that email')
	  }

	  const valid = await bcrypt.compare(password, user.password)

	  if (!valid) {
		throw new Error('Incorrect password')
	  }

	  return jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: '1d' }
	  )
	}
  }
};

const typeDefs = fs.readFileSync('/usr/src/src/graphql/schema.gql', 'utf8');
const schema = makeAugmentedSchema({ typeDefs, resolvers });
export default schema
