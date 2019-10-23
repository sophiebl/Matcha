import React from 'react';
import { Route, Redirect } from "react-router-dom";

/*
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const ME = gql`
	{
    me {
      uid
      firstname
    }
  }
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { loading, error, data } = useQuery(ME, { fetchPolicy: 'cache-and-network' });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return <Route {...rest} render={props => {
        if (data && data.me && data.me.uid)
            return <Component {...props} />
        else
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }} />
};
*/

//TODO: query me to check token

const PublicRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Redirect to={{ pathname: '/profile', state: { from: props.location } }} />
			) : (
				<Component {...props} />
			)
	} />
);

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
			)
	} />
);

//export default PrivateRoute;
export { PublicRoute, PrivateRoute };
