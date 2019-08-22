import express from 'express';
import cors    from 'cors';
import exprgql from 'express-graphql';
import schema  from './graphql/schema.js';
import routes  from './routes.js';
import { v1 as neo4j } from 'neo4j-driver';

const driver = neo4j.driver('bolt://db:7687', neo4j.auth.basic('neo4j', 'matcha'));
const app    = express();

routes.setRoutes(app);
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use('/api', exprgql( req =>( {
    schema: schema,
	graphiql: true,
	context: { driver },
	formatError: error => ({
		message: error.message,
		//		locations: error.locations,
		//stack: error.stack ? error.stack.split('\n') : [],
		//path: error.path,
	})
})));
app.listen(4000, () => console.log("API started on port 4000"));
