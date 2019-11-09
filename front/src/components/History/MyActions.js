import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

import './History.scss'

const GET_MY_ACTIONS = gql`
	{
		me {
			uid

			likedUsers {
				uid
				username
			}

			visitedUsers {
				uid
				username
			}

		}
	}
	`;

const show = (title, users) => <>
	<h3>{title}</h3>
	{ users.map(({ uid, username }) => <div key={uid}>- {username}</div>) }
</>

const MyActions = () => {
	const { loading, error, data } = useQuery(GET_MY_ACTIONS);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	const likedUsers = data.me.likedUsers;
	const visitedUsers = data.me.visitedUsers;

	return (
		<div>
				{ show('Liked', likedUsers) }
				{ show('Visited', visitedUsers) }
		</div>
	)
}

export default MyActions;
