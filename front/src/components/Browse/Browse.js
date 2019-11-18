import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";
import React, { useEffect, useReducer } from 'react';
import UserProfile from '../Profile/UserProfile';
import Nav from "../Nav/Nav";
import './Browse.scss'

const GET_USERS = gql`
{
	User {
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
    }
	}
}
`;

const Browse = () => {
	const { loading, error, data } = useQuery(GET_USERS);

	function reducer(state, action) {
		switch (action.type) {
			case 'dislike':
				return { user: data.User.shift() };
			case 'reset':
				return { user: action.payload };
			default:
				throw new Error();
		}
	}
	const [state, dispatch] = useReducer(reducer, { uid: 'none', tags: [] });

	useEffect(() => {
		const onCompleted = (data) => dispatch({ type: 'reset', payload: data.User.shift() });
		const onError = (error) => console.log(error);
		if (onCompleted || onError)
			if (onCompleted && !loading && !error)
				onCompleted(data);
		else if (onError && !loading && error)
			onError(error);
	}, [loading, data, error]);
	
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	return <>	
		{ state.user == null ?
				(
					<p>Plus personne, reviens plus tard !</p>
				) : (
					<div className="browse">
						<UserProfile key={state.user.uid} user={state.user} dispatch={dispatch} />
					</div>
				)
		}
		<Nav />
	</>
}

export default Browse;
