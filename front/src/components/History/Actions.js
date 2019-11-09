import React from 'react';
//import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
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
		{ div('Liked', data.me.likedUsers) }
		{ div('Visited', data.me.visitedUsers) }
	</div>
}

export default Actions;
