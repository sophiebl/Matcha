import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './scss/App.scss';
import Start from './components/start/Start';
import Login from './components/login/Login';
import Logout from './components/login/Logout';
import Signup from './components/signup/Signup';
import Browse from './components/browse/Browse';
import MessagesIndex from './components/messages/MessagesIndex';
import Messages from './components/messages/Messages';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCoffee, faTimes, faShoppingCart, faCartPlus, faMapMarkerAlt, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar, faHeart, faCommentAlt, faUser } from '@fortawesome/free-regular-svg-icons';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

library.add(faCheckSquare, faCoffee, faStar, faTimes, faShoppingCart, faHeart, faCartPlus, faCommentAlt, faUser, faMapMarkerAlt, faAngleLeft);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
	headers: {
	  ...headers,
		authorization: token ? `Bearer ${token}` : "",
	},
	credentials: 'include'
  }
});

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  link: ApolloLink.from([
	authLink,
	onError(({ graphQLErrors, networkError }) => {
	  if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) =>
		  console.log(
			`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
		  ),
		);
	  if (networkError) console.log(`[Network error]: ${networkError}`);
	}),
	new HttpLink({
	  uri: 'http://localhost:4000/graphql',
	  credentials: 'include'
	}),
  ]),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
	<ApolloProvider client={client}>
	  <Router>
		<div className="App">
		  <Route exact path="/" component={Start} />
		  <Route path="/login" component={Login} />
			<Route path="/logout" component={Logout} />
		  <Route path="/signup" component={Signup} />
		  <Route path="/browse" component={Browse} />
		  <Route exact path="/messages" component={MessagesIndex} />
		  <Route path="/messages/:uid" component={Messages} />
		</div>
	  </Router>
	</ApolloProvider>
  );
}

export default App;
