const express         = require('express');
const cors            = require('cors');
const bodyParser      = require('body-parser');
const express_graphql = require('express-graphql');
const schemas         = require('./graphql/schemas');
const route           = require('./routes.js');
const resolversUser   = require('./graphql/resolvers/user');

const app = express();

app.use(cors({credentials: true, origin: 'http://front:3000'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const root = {
	hello: () => {
		return "Hello world!";
	},
	...resolversUser,
}

app.use('/api', express_graphql( req =>( {
    schema: schemas.registerSchema,
    rootValue: root,
    graphiql: true,
    formatError: (err) => {
        return ({ message: err.message, statusCode: 403})
    }
})));

const http = require('http').Server(app);
http.listen(4000, () => console.log("Server started"))

route.setRoutes(app);
