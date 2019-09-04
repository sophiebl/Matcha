import express from 'express';
import schema  from './graphql/schema.js';
import { v1 as neo4j }  from 'neo4j-driver';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv'

dotenv.config()

const driver = neo4j.driver('bolt://db:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));
const app    = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

const apolloServer = new ApolloServer({
  schema,
  cors: corsOptions,
  context: ({ req }) => ({
    driver,
    req,
    token: req.headers.authorization || '',
  }),
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
});

apolloServer.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});