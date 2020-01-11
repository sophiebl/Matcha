import schema  from './graphql/schema.js';
import { v1 as neo4j }  from 'neo4j-driver';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import uniqid from 'uniqid';

dotenv.config()

const driver = neo4j.driver('bolt://db:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASS || 'letmein'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

const apolloServer = new ApolloServer({
  schema,
  cors: corsOptions,
  context: ({ req }) => ({
    driver,
    req,
    headers: req.headers,
    token: (req.headers.authorization && req.headers.authorization.slice(7)) || '',
    cypherParams: {
      currentUserUid: jwt.verify((req.headers.authorization && req.headers.authorization.slice(7)), process.env.JWT_SECRET, function(err, decoded) {
        if (!decoded)
          return null;
        return decoded.uid;
      }),
      uniqid: uniqid(),
    }
  }),
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
});

apolloServer.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
