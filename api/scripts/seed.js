import { v1 as neo4j }  from 'neo4j-driver';
import dotenv from 'dotenv'
import faker from 'faker';
import uniqid from 'uniqid';

import crypto from 'crypto-js/core'
import SHA256 from 'crypto-js/sha256'

dotenv.config()
const driver  = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));
const session = driver.session();


/* -----[ Faker config ]----- */
faker.locale = 'fr';
faker.seed(42);

/* -----[ Queries ]----- */
const CREATE_USER = `
CREATE (:User {
  uid: $uuid,
  firstname: '{{name.firstName}}',
  lastname: '{{name.lastName}}',
  email: '{{internet.email}}',
  password: $hash,
  birthdate: '{{date.past}}',
  gender: $gender,
  bio: '{{lorem.sentence}}',
  elo: $elo,
  prefAge: $prefAge,
  prefOrientation: $prefOrientation,
  prefRadius: $prefRadius,
  confirmToken: 'null',
  resetToken: 'null'
})`;

const CREATE_TAG = `
CREATE (:TAG {
  uid: $uuid,
  name: $name
})`;

/* -----[ Seeding functions ]----- */
async function users(amount = 1) {
  for (var i = 0; i < amount; i++) {
	const uuid = uniqid('user-');
	//const hash = await SHA256(faker.internet.password, 'salt').toString();
	const hash = await SHA256('password', 'salt').toString();
	const gender = faker.random.arrayElement(['homme', 'femme']);
	const elo = faker.random.number({min: 0, max: 100});
	const prefAge = faker.random.number({min: 18, max: 100});
	const prefOrientation = faker.random.arrayElement(['homme', 'femme']);
	const prefRadius = faker.random.number({min: 2, max: 250});

	await session.run(faker.fake(CREATE_USER), {uuid, hash, gender, elo, prefAge, prefOrientation, prefRadius})
  }
}

async function tags() {
  const names = ['sport', 'cinema', 'tech', 'design', 'mode'];
  for (var i = 0; i < 5; i++) {
	const uuid = uniqid('tag-');
	const name = names[i];

	await session.run(faker.fake(CREATE_TAG), {uuid, name})
  }
}

/* -----[ Main function ]----- */
async function seed() {
  await users(10);
  await tags();

  console.log('Database is reaady!');
  session.close();
  process.exit(0);
}

seed();
