import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

import './History.scss'

const GET_USERS_ACTIONS = gql`
	{
		me {
			uid

			likedByUsers {
				uid
				username
			}

			visitedByUsers {
				uid
				username
			}

		}
	}
	`;

const UsersActions = () => {
	const { loading, error, data } = useQuery(GET_USERS_ACTIONS);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	const likedBYUsers = data.me.likedByUsers;
	const visitedByUsers = data.me.visitedByUsers;

	return (
		<div>
				<h3>Liked by</h3>
				{ likedBYUsers.map(({ uid, username }) => <div key={uid}>- {username}</div>) }
				<h3>Visited by</h3>
				{ visitedByUsers.map(({ uid, username }) => <div key={uid}>- {username}</div>) }
		</div>
	)
}

export default UsersActions;
