import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCoffee, faTimes, faShoppingCart, faCartPlus, faMapMarkerAlt, faAngleLeft, faCog, faPen, faUsers, faPlus, faImage, faCheck, faHistory, faWalking } from '@fortawesome/free-solid-svg-icons';
import { faStar, faHeart, faCommentAlt, faUser } from '@fortawesome/free-regular-svg-icons';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { Router } from '../Routes/Routes';

import './App.scss';

library.add(faCheckSquare, faCoffee, faStar, faTimes, faShoppingCart, faHeart, faCartPlus, faCommentAlt, faUser, faMapMarkerAlt, faAngleLeft, faCheck, faCog, faPen, faUsers, faPlus, faImage, faHistory, faWalking);

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
				graphQLErrors.forEach(({ message, locations, path }) =>	console.log( `[GraphQL error]: ${message}, Location: ${locations}, Path: ${path}`));
			if (networkError) {
				console.log('[Network error]:');
				console.log(networkError);
			}
		}),
		ApolloLink.split(
			({ query }) => {
				const { kind, operation } = getMainDefinition(query);
				return kind === 'OperationDefinition' && operation === 'subscription';
			},
			new WebSocketLink({
				uri: `ws://localhost:4000/graphql`,
				options: {
					lazy: true,
					reconnect: true,
					connectionParams: async () => {
						const token = localStorage.getItem('token');
						return {
							token: token,
							headers: {
								Authorization: token ? `Bearer ${token}` : "",
							},
						}
					},
				}
			}),
			new HttpLink({
				uri: 'http://localhost:4000/graphql',
				credentials: 'include'
			}),
    ),
	]),
	cache: new InMemoryCache(),
});

const App = () => {
	return <>
		<ApolloProvider client={client}>
			<div className="App">
				<Router />	
			</div>
		</ApolloProvider>
	</>
}

export default App;
