import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

import { store } from 'react-notifications-component';

import { getCurrentUid } from '../../Helpers';
import { StoreContext } from '../App/Store';

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

	return <Route {...rest} render={props => 
			localStorage.getItem('token') ? (
				<Component {...props} />
			) : (
				<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
			)
	} />
};

export default PrivateRoute;
