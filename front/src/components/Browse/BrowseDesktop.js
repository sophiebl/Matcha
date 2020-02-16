import React, { useEffect, useReducer } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

import UserPreview from '../Profile/UserPreview';
import Nav from "../Nav/Nav";
import BrowseFilter from './BrowseFilter';
import './Browse.scss'

import './Browse.scss'

const GET_USERS = gql`
query bruh($offset: Int, $ageMin: Int, $ageMax: Int, $distance: Int, $elo: Int){
	me: me{
		uid
		firstname
		lat
		long
	}
	
	users: getMatchingUsers(offset: $offset, ageMin: $ageMin, ageMax: $ageMax, distance: $distance, elo: $elo) {
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
	const { loading, error, data, fetchMore } = useQuery(
	  GET_USERS,
	  {
		variables: {
		  offset: 0,
		},
		fetchPolicy: "cache-and-network",
	  }
	);

  const onClick =(() => {
	fetchMore({
	  variables: {
		offset: 10//data.feed.length
	  },
	  updateQuery: (prev, { fetchMoreResult }) => {
		if (!fetchMoreResult) return prev;
		console.log('prev', prev);
		console.log('fmr', fetchMoreResult);
		return Object.assign({}, prev, {
		  users: [/*...prev.users,*/ ...fetchMoreResult.users]
		});
	  }
	})
  });

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
					<>
						<BrowseFilter fetchMore={fetchMore}/>
						{/*console.log(data)*/}
						<button onClick={onClick}>Fetch more</button>
						<div className="browse">
							{renderedUsersProfiles}
						</div>
					</>
				)
		}
		<Nav />
	</>
}

export default BrowseDesktop;
