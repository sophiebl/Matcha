import React from 'react';

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

const CONNECT = gql`
	subscription {
		connect
	}
`;

const CommonStuff = () => {
	const { /*loading,*/ error, data } = useSubscription(CONNECT);
	if (error) return <span>Subscription error!</span>;
	if (data) console.log(data);

	return <>
			
	</>
}

export default CommonStuff;
