import React from 'react';
//import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';

import './History.scss'

const div = (title, users) => <>
	<h3>{title}</h3>	
	{ users.map(({ uid, username }) => (
		//<Link to="/user" style={{color: 'black', display: 'inline-block', float: 'left'}}>
			<div key={uid}>- {username}</div>
		//</Link>
	))}
</>

const Actions = ({ query }) => {
	const { loading, error, data } = useQuery(query);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return <div>
		{ div(data.me.likedUsers ? 'Liked' : 'Liked by', data.me.likedUsers || data.me.likedByUsers) }
		{ div(data.me.visitedUsers ? 'Visited' : 'Visited by', data.me.visitedUsers || data.me.visitedByUsers) }
	</div>
}

export default Actions;
