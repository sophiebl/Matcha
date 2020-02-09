import React from 'react';

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

import { store } from 'react-notifications-component';


const USER_STATE_CHANGED = gql`
	subscription userStateChanged($uid: ID!) {
		userStateChanged(uid: $uid) {
			state
		}
	}
`;

const UsersState = ({user}) => {
    // console.log(user   );
    // console.log(user.uid   );
    // console.log(userMe.me.uid   );
	const { /*loading,*/ errorState, dataState } = useSubscription(USER_STATE_CHANGED, { variables: { uid: user.uid } });
	if (errorState) {
        console.log("sub error");
        return <span>Subscription error!</span>;
    }
	if (dataState){
		console.log("UN USER VIENT DE SE CONNECTER");
	 	console.log(dataState);
	}

    // console.log("NE PASSE PAS PAR LA SUBSCRIPTION");

	return( 
		<div className={`${(dataState ? (dataState.userStateChanged.state ? 
			store.addNotification({
				title: 'Nouvelle connection',
				message: 'Un nouvel user vient de se connecter',
				type: 'default',
				container: 'bottom-left',
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				dismiss: {
					duration: 3000 
				}
			}) 
			: "offline" ) : "")}`}>
		</div> 
	)
}

export default UsersState;
