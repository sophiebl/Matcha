import React from 'react';
import { Route, Redirect } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

const CONNECT = gql`
	subscription {
		connect
	}
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { /*loading,*/ error, data } = useSubscription(CONNECT);
	if (error) return <span>Subscription error!</span>;
	if (data) {console.log("afffiche des datas", data); }

	return <Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
			)
	} />
};

export default PrivateRoute;
