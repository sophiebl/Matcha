import React, { useState }from 'react';
import { Redirect, useHistory } from 'react-router-dom'

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const LOGOUT = gql`
	mutation {
		logout
	}
`;

const Logout = () => {
	const [getFirst, setFirst] = useState(true);

	const history = useHistory();

	const [logout] = useMutation(LOGOUT, {
		onCompleted: data => {
			localStorage.removeItem('token');
			history.push('/');
		},
		onError: data => console.log(data),
	});

	if (getFirst === true) {
		setFirst(false);
		logout();
	}

	return <Redirect to='/' />
}

export default Logout;
