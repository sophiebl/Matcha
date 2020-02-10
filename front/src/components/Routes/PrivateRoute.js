import React from 'react';
import { Route, Redirect } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

import { store } from 'react-notifications-component';

import { getCurrentUid } from '../../Helpers';

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
		}
	}
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
	useSubscription(CONNECT);

	useSubscription(RECEIVED_NOTIFICATION, {
		variables: { uid: getCurrentUid() },
		onSubscriptionData: ({ client, subscriptionData }) => {
			const notif = subscriptionData.data.receivedNotification;
			store.addNotification({
				title: notif.title,
				message: notif.message,
				type: notif.type,
				container: 'bottom-left',
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				dismiss: { duration: 3000 },
			});
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
