const neo4j = require('neo4j-driver').v1

const driver = neo4j.driver('bolt://db', neo4j.auth.basic('neo4j', 'matcha'))

const session = driver.session()

session
    .run(`
        MATCH (p:Person)
        RETURN p AS moi
    `)
    .then((results) => {
        results.records.forEach((record) => console.log(record.get('moi')))
        session.close()
        driver.close()
    })
