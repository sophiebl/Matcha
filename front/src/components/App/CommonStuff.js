import React from 'react';

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';
import UsersState from './UsersState';

const CONNECT = gql`
	subscription {
		connect
	}
`;


const CommonStuff = ({ user }) => {
	const { /*loading,*/ error, data } = useSubscription(CONNECT);
	if (error) return <span>Subscription error!</span>;
	if (data) {
	 console.log(data);
	 console.log("CA MARCHE");
	}
	console.log("CA MARCHE PPPPPPAS");

	return <>
		<UsersState user={user}/>	
	</>
}

export default CommonStuff;
