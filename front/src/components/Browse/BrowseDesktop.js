import React, { useEffect, useReducer } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

import UserPreview from '../Profile/UserPreview';
import Nav from "../Nav/Nav";

import './Browse.scss'

const GET_USERS = gql`
query {
	me: me{
		uid
		firstname
		lat
		long
	}
	
	users: getMatchingUsers {
		uid
		bio
		gender
		firstname
		lastname
		birthdate
		avatar
		elo
		likesCount
		prefDistance
		tags {
			uid
			name
		}
		likedUsers {
			uid
			username
		}
		images {
			uid
			src
		}
		isConnected
		lastVisite
		lat
		long
    }
}
`;

const BrowseDesktop = () => {
	const { loading, error, data } = useQuery(GET_USERS);
	function reducer(state, action) {
		switch (action.type) {
			case 'like':
				window.location = "/browse";
				return {};
			case 'dislike':
				window.location = "/browse";
				return {};
			case 'reset':
				return { user: action.payload };
			default:
				throw new Error();
		}
	}
	const [state, dispatch] = useReducer(reducer, { uid: 'none', tags: [] });
	const users = state.user;

	useEffect(() => {
		const onCompleted = (data) => {
			dispatch({ type: 'reset', payload: data.users });
		};
		const onError = (error) => console.log(error);
		if (onCompleted || onError)
			if (onCompleted && !loading && !error)
				onCompleted(data);
		else if (onError && !loading && error)
			onError(error);
	}, [loading, data, error]);
	
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	let seen = [];
	if(users) {
		var renderedUsersProfiles = users.map(user => {
		  let r = null;
		  if (!seen.includes(user.uid))
			r = <UserPreview key={user.uid} user={user} dispatch={dispatch} userMe={data}/>;
		  seen.push(user.uid);
		  return r;
		});
	}

	return <>	
		{ state == null ?
				(
					<p>Plus personne, reviens plus tard !</p>
				) : (
					<div className="browse">
						{renderedUsersProfiles}
					</div>
				)
		}
		<Nav />
	</>
}

export default BrowseDesktop;
