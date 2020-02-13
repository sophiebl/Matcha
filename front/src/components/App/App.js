import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCoffee, faTimes, faShoppingCart, faCartPlus, faMapMarkerAlt, faAngleLeft, faCog, faPen, faUsers, faPlus, faImage, faCheck, faHistory, faWalking, faChevronCircleRight, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
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

// import CommonStuff from './CommonStuff';
import Router from '../Routes/Router';

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import ReactBreakpoints from 'react-breakpoints'

import StoreProvider from './Store'

import './App.scss';

library.add(faCheckSquare, faCoffee, faStar, faTimes, faChevronCircleRight, faChevronCircleLeft, faShoppingCart, faHeart, faCartPlus, faCommentAlt, faUser, faMapMarkerAlt, faAngleLeft, faCheck, faCog, faPen, faUsers, faPlus, faImage, faHistory, faWalking);

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
	uri: process.env.REACT_APP_API_HOST,
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
				uri: process.env.REACT_APP_WS_HOST,
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
				uri: process.env.REACT_APP_API_HOST,
				credentials: 'include'
			}),
    ),
	]),
	cache: new InMemoryCache(),
});

const breakpoints = {
	mobile: 320,
	mobileLandscape: 480,
	tablet: 768,
	tabletLandscape: 1024,
	desktop: 1200,
	desktopLarge: 1500,
	desktopWide: 1920,
}

const App = () => {
	return <>
		<ReactBreakpoints breakpoints={breakpoints}>
			<ApolloProvider client={client}>
				<StoreProvider>
					<div className="App">
						{/* <CommonStuff /> */}
						<ReactNotification className="notif" />
						<Router />
					</div>
				</StoreProvider>
			</ApolloProvider>
		</ReactBreakpoints>
	</>
}

export default App;
