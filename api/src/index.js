import express from 'express';
import cors    from 'cors';
import schema  from './graphql/schema.js';
import routes  from './routes.js';
import { v1 as neo4j }  from 'neo4j-driver';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

dotenv.config()

const driver = neo4j.driver('bolt://db:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));
const app    = express();

routes.setRoutes(app);
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

const apolloServer = new ApolloServer({
  schema,
  context: { driver },
  playground: true
});
apolloServer.applyMiddleware({ app });

app.listen(4000, () => console.log("GraphQL API started on localhost:4000/graphql"));
