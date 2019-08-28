const errors = require('../errors');
const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver('bolt://db', neo4j.auth.basic('neo4j', 'matcha'))

const session = driver.session();

module.exports = {
	user,
	users
}

async function user ({firstname, lastname})
{
	return await session.run(`MATCH (u:User {name: $name}) RETURN u;`, {name})
	.then(result => result.records[0].get('u').properties);
}

async function users ({first, last})
{
	query = `
		MATCH (u:User)
		RETURN u
		ORDER BY u.id `
		+ (last === undefined ? ('ASC' + (first === undefined ? '' : ` LIMIT $first`)) : (`DESC LIMIT $last`))
		+ `;
	`;

	return await session.run(query, {first, last})
	.then(result => {
		let data = [];
		result.records.forEach((record) => {
			data.push(record.get('u').properties);
		});
		return data;
	});
}
