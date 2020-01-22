import React from 'react';
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Redirect to={{ pathname: '/profile', state: { from: props.location } }} />
			) : (
				<Component {...props} />
			)
	} />
);

export default PublicRoute;
