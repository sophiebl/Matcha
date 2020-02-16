import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription, useQuery } from '@apollo/react-hooks';

import { store } from 'react-notifications-component';

import { getCurrentUid } from '../../Helpers';
import { StoreContext } from '../App/Store';

const ME = gql`
		{
			me {
				uid
				bio
				gender
				tags {
					uid
					name
				}
				prefAgeMin
				prefAgeMax
				prefDistance
				prefOrientation
				lat
				long
				location
			}

			Tag {
				uid
				name
			}
		}
`;

const CONNECT = gql`
	subscription {
		connect
	}
`;

const RECEIVED_NOTIFICATION = gql`
	subscription receivedNotification($uid: ID!) {
		receivedNotification(uid: $uid) {
			type
			title
			message
			context
		}
	}
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
	const { notifs } = useContext(StoreContext);
	const location = useLocation();

	useSubscription(CONNECT);

	useSubscription(RECEIVED_NOTIFICATION, {
		variables: { uid: getCurrentUid() },
		onSubscriptionData: ({ client, subscriptionData }) => {
			const notif = subscriptionData.data.receivedNotification;
			notifs.setCount(notifs.getCount + 1);
			if (location.pathname !== "/messages/" + notif.context) {
			  store.addNotification({
			  	title: notif.title,
			  	message: notif.message,
			  	type: notif.type,
			  	container: 'bottom-left',
			  	animationIn: ["animated", "fadeIn"],
			  	animationOut: ["animated", "fadeOut"],
			  	dismiss: { duration: 3000 },
			  });
			}
		},
	});

	const { loading, error, data } = useQuery(ME);
	if (loading) return <p>Loading...</p>;
	if (error) return <Redirect to={{ pathname: '/login'}} />;
	const redir = (!data || !data.me || data.me.prefAgeMin === null || data.me.prefAgeMax === null || data.me.prefDistance === null|| data.me.prefOrientation === null|| data.me.bio === null || data.me.gender === null);

	return <Route {...rest} render={props => {
		alert("PRivate route")
		return localStorage.getItem('token') ? (
			!redir ? (
				console.log("!REDIR"),
				<Component {...props} />
			) : (
				console.log("REDIR"),
				(location.pathname === "/preferences" || location.pathname === "/logout") ? <Component {...props} /> : <Redirect to={{ pathname: '/preferences', state: { notif: true } }} />
			)
		) : (
			console.log("PAS DE LOCAL STORAGE"),
			<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
		)
	}} />


};

export default PrivateRoute;
