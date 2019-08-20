import { makeAugmentedSchema } from 'neo4j-graphql-js';
import fs from 'fs';

const typeDefs = fs.readFileSync('/usr/src/graphql/schema.gql', 'utf8');
const schema = makeAugmentedSchema({ typeDefs });
export default schema
