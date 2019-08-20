import express from 'express';
import cors    from 'cors';
import neo4j   from 'neo4j-driver';
import exprgql from 'express-graphql';
import schema  from './graphql/schema.js';
import routes  from './routes.js';

const driver = neo4j.v1.driver('bolt://db:7687', neo4j.v1.auth.basic('neo4j', 'matcha'));
const app    = express();

routes.setRoutes(app);
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use('/api', exprgql( req =>( {
    schema: schema,
	graphiql: true,
	context: { driver },
    formatError: (err) => {
        return ({ message: err.message, statusCode: 403})
    }
})));
app.listen(4000, () => console.log("API started on port 4000"));
