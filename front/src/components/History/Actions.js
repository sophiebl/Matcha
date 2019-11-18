import React from 'react';
//import { Link } from 'react-router-dom';

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

const div = (title, users) => <>
	<h3>{title}</h3>	
	{ users.map(({ uid, username }) => (
		//<Link to="/user" style={{color: 'black', display: 'inline-block', float: 'left'}}>
			<div key={uid}>- {username}</div>
		//</Link>
	))}
</>

const Actions = ({ mode }) => {
	let query;
	if (mode === 'own')
		query = GET_MY_ACTIONS;
	else if (mode === 'others')
		query = GET_USERS_ACTIONS;

	const { loading, error, data } = useQuery(query);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return <div>
		{ div(data.me.likedUsers ? 'Liked' : 'Liked by', data.me.likedUsers || data.me.likedByUsers) }
		{ div(data.me.visitedUsers ? 'Visited' : 'Visited by', data.me.visitedUsers || data.me.visitedByUsers) }
	</div>
}

export default Actions;
