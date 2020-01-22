import React from 'react';
import { Route, Redirect } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

//TODO: query me to check token

const CONNECT = gql`
	subscription {
		connect
	}
`;

const PublicRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Redirect to={{ pathname: '/profile', state: { from: props.location } }} />
			) : (
				<Component {...props} />
			)
	} />
);

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { /*loading,*/ error, data } = useSubscription(CONNECT);
	if (error) return <span>Subscription error!</span>;
	if (data) console.log(data);

	return <Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
			)
	} />
};

export { PublicRoute, PrivateRoute };
