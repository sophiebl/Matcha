import React from 'react';

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';


const USER_STATE_CHANGED = gql`
	subscription userStateChanged($uid: ID!) {
		userStateChanged(uid: $uid) {
			state
		}
	}
`;

const UsersState = ({user}) => {
    console.log(user   );
	const { /*loading,*/ errorState, dataState } = useSubscription(USER_STATE_CHANGED, { variables: { uid: user.uid } });
	if (errorState) {
        console.log("sub error");
        return <span>Subscription error!</span>;
    }
	if (dataState){
		console.log("UN USER VIENT DE SE CONNECTER");
	 	console.log(dataState);
	}
    console.log("NE PASSE PAS PAR LA SUBSCRIPTION");

	return <>
			
	</>
}

export default UsersState;
