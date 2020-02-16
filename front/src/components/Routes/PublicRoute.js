import React from 'react';
import { Route, Redirect } from "react-router-dom";

import { getCurrentUid } from '../../Helpers.js';

const PublicRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props =>
			getCurrentUid() == null ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/profile', state: { from: props.location } }} />
			)
	} />
);

export default PublicRoute;
