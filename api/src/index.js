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

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

routes.setRoutes(app);
app.use(bodyParser.json());
app.use(cors(corsOptions));

const apolloServer = new ApolloServer({
  schema,
  cors: corsOptions,
  context: ({ req }) => ({
	token: req.headers.authorization || ''
  }),
  playground: true
});
apolloServer.applyMiddleware({ app, path: '/', cors: false });

app.listen(4000, () => console.log("GraphQL API started on localhost:4000/graphql"));
