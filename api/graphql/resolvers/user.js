const errors = require('../errors');
const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver('bolt://db', neo4j.auth.basic('neo4j', 'matcha'))

const session = driver.session();

module.exports = {
	user: async (params) => {
		return await session.run('MATCH (u:User {name: $name}) RETURN u;', params)
			.then(result => result.records[0].get(0).properties);
	},
	users: async () => {
		return await session.run('MATCH (u:User) RETURN u;')
			.then(result => {
				let data = [];
				result.records.forEach((record) => {
					data.push(record.get(0).properties);
				});
				return data;
			});
	}
}
