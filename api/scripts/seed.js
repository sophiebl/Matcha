import { v1 as neo4j }  from 'neo4j-driver';
import dotenv from 'dotenv'
import faker from 'faker';
import uniqid from 'uniqid';
import fetch from 'node-fetch';

import crypto from 'crypto'

dotenv.config()
const driver  = neo4j.driver('bolt://db:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));
const session = driver.session();


/* -----[ Faker config ]----- */
faker.locale = 'fr';
//faker.seed(42);

/* -----[ Queries ]----- */
const RESET = `
MATCH (a)
DETACH DELETE (a)
`;

const CREATE_USER = `
CREATE (:User {
  uid: $uid,
  username: $firstname,
  firstname: $firstname,
  lastname: '{{name.lastName}}',
  email: '{{internet.email}}',
  username: $firstname,
  password: $hash,
  birthdate: $birthdate,
  gender: $gender,
  bio: '{{lorem.sentence}}',
  elo: $elo,
  prefAgeMin: $prefAgeMin,
  prefAgeMax: $prefAgeMax,
  prefOrientation: $prefOrientation,
  prefDistance: $prefDistance,
  confirmToken: 'true',
  resetToken: 'null',
  lastVisite: '15 janvier à 17h',
  lat: $lat,
  long: $long,
  location: $location
})-[:HAS_IMG]->(:Image {uid: $avatarUid, src: $avatarSrc})`;

const CREATE_TAG = `
CREATE (:Tag {
  uid: $uuid,
  name: $name
})`;

const HAS_TAGS = `
MATCH (t:Tag)
WITH [t] as tags
UNWIND tags as tag
MATCH (users:User)
WHERE rand() < 0.3
CREATE (users)-[:HAS_TAG]->(tag)
`;

const LIKED = `
MATCH (l:User)
WITH [l] as likeds
UNWIND likeds as liked
MATCH (likers:User)
WHERE rand() < 0.3 AND likers <> liked
CREATE (likers)-[:LIKED]->(liked)
`;

const BLOCKED = `
MATCH (b:User)
WITH [b] as blockeds
UNWIND blockeds as blocked
MATCH (blockers:User)
WHERE rand() < 0.03 AND blockers <> blocked
CREATE (blockers)-[:BLOCKED]->(blocked)
`;

const MESSAGES = `
MATCH (u1:User {firstname: 'Camille'}), (u2:User {firstname: 'Noa'})
CREATE (u1)-[:HAS_CONV]->(conv:Conversation {uid: 'conv-1'})<-[:HAS_CONV]-(u2)
CREATE (msg1:Message {uid: 'msg-1', content: "Hey, moi c'est Noa !"})<-[:HAS_MSG]-(conv)-[:HAS_MSG]->(msg2:Message {uid: 'msg-2', content: "Hey Noa, moi c'est Camille !"})
CREATE (msg1)<-[:AUTHORED]-(u2), (msg2)<-[:AUTHORED]-(u1)
RETURN u1, u2, conv, msg1, msg2
`;

/* -----[ Seeding functions ]----- */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function gen() {
 const res = (await fetch(`http://source.unsplash.com/random/?${gender === "homme" ? "man" : "woman"}`, { headers: {'Cache-Control': 'no-cache'} })).url.split('?')[0]; 
}

async function users(amount = 1) {
  for (var i = 0; i < amount; i++) {
  	const uid = uniqid('user-');
  	const firstname = faker.name.firstName();
  	const birthdate = faker.date.between("1974-01-01", "2001-12-31").toString();
  	const username = firstname;
  	const hash = crypto.createHmac('sha256', 'matcha').update('password' + 'salt').digest('hex');
  	const gender = faker.random.arrayElement(['homme', 'femme']);
  	const lat = faker.address.latitude();
    const long = faker.address.longitude();
    const location = faker.address.city();
  	const elo = faker.random.number({min: 0, max: 100});
  	const prefAgeMin = faker.random.number({min: 18, max: 100});
  	const prefAgeMax = prefAgeMin + 10;
  	const prefOrientation = faker.random.arrayElement(['homme', 'femme']);
    const prefDistance = faker.random.number({min: 5, max: 200});
  	const avatarUid = uniqid('img-');
    const avatarSrc = (await fetch(`http://source.unsplash.com/random/?${gender === "homme" ? "man" : "woman"}`, { headers: {'Cache-Control': 'no-cache'} })).url.split('?')[0];
    await sleep(2000);
  
  	await session.run(faker.fake(CREATE_USER), {uid, firstname, birthdate, username, hash, gender, lat, long, location, elo, prefAgeMin, prefAgeMax, prefOrientation, prefDistance, avatarUid, avatarSrc});
  }
}



async function tags() {
	const names = ['Sport', 'Cinema', 'Tech', 'Design', 'Mode', 'Art', 'Culture', 'Science-Fiction', 'Dessin', 'Peinture', 'Street-Art', 'Cuisine', 'Jeux-video'];
	for (const i in names) {
	  const uuid = uniqid('tag-');
	  const name = names[i];

	  await session.run(faker.fake(CREATE_TAG), {uuid, name});
  }
}

async function hasTags() {
  await session.run(faker.fake(HAS_TAGS));
}

async function liked() {
  await session.run(faker.fake(LIKED));
}

async function blocked() {
  await session.run(faker.fake(BLOCKED));
}

async function messages() {
  await session.run(faker.fake(MESSAGES));
}

/* -----[ Main function ]----- */
async function reset() {
	await session.run(faker.fake(RESET));
}

async function seed() {
	await users(10);
  await tags();
	await hasTags();
  await liked();
  await blocked();
  await messages();

  console.log('Database is reaady!');
  session.close();
  process.exit(0);
}

reset();
seed();
