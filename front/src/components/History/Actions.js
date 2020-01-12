import React from 'react';
import { useHistory } from 'react-router-dom';

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

const div = (title, users, history) => <>
	<h3>{title}</h3>	
	{ users.map(({ uid, username }) => (
		<div className="action" key={uid} onClick={() => history.push("/browse/" + username)}>
			{username}
		</div>
	))}
</>

const Actions = ({ mode }) => {
	let query;
	if (mode === 'own')
		query = GET_MY_ACTIONS;
	else if (mode === 'others')
		query = GET_USERS_ACTIONS;

	const { loading, error, data } = useQuery(query);
	const history = useHistory();

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return <div>
		{ div(data.me.likedUsers ? 'Vous avez liké' : 'Ils vous ont liké', data.me.likedUsers || data.me.likedByUsers, history) }
		{ div(data.me.visitedUsers ? 'Vous avez vu ces profils' : 'Ils ont vu votre profil', data.me.visitedUsers || data.me.visitedByUsers, history) }
	</div>
}

export default Actions;
