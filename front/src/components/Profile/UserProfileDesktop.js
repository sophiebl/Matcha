import React, { useEffect, useState, useReducer } from 'react';

import { gql } from "apollo-boost";
import { useMutation, useQuery } from '@apollo/react-hooks';

import MainInfos from './MainInfos';
import Bio from './Bio';
import LikeDislike from './LikeDislike';
import BlockButton from './ReportButton';
import Tag from './Tag';
import Nav from "../Nav/Nav";
import './Profile.scss'

const VISIT_PROFILE = gql`
	mutation visitProfile($uid: ID!) {
		visitProfile(uid: $uid) {
			username
		}
	}
`;

const GET_USER = gql`
    query User($uid: ID) {	
        me: me{
            uid
            firstname
            lat
            long
        }

        User(uid: $uid) {
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

const UserProfileDesktop = ({ match }) => {
    const { loading, error, data } = useQuery(GET_USER, {
        variables: {
          'uid': match.params.uid,
        },
        fetchPolicy: 'cache-and-network',
	});

	// const [visitProfile] = useMutation(VISIT_PROFILE, {
	// 	onError: data => console.log(data),
	// });

    function reducer(state, action) {
		switch (action.type) {
			case 'like':
				return {  user: data.users.shift() };
			case 'dislike':
				return { };
			case 'reset':
				return {  };
			default:
				throw new Error();
		}
	}
    const [state, dispatch] = useReducer(reducer, { uid: 'none', tags: [] });
    
	const [userInfos, setUserInfos] = useState([]);  

	// useEffect(() =>	{
	// 	visitProfile({
	// 		variables: {
	// 			uid: match.params.uid,
	// 		}
	// 	});
	// }, [visitProfile, match.params.uid]);

    useEffect(() => {
		const onCompleted = (data) => {
            setUserInfos(data);
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

    console.log(match);

    console.log(data);
    const user = data.User[0];
    const userMe = data.me;

    const { uid, bio, tags, likedUsers, lat, long } = user;

	const latMe = parseFloat(userMe.lat);
	const longMe = parseFloat(userMe.long);
	const latUser = parseFloat(lat);
	const longUser = parseFloat(long);

	const deg2rad = deg => {
		return deg * (Math.PI / 180);
	};

	const getDistanceBetweenUsers = (latMe, longMe, latUser, longUser) => {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(latUser - latMe); // deg2rad below
		var dLon = deg2rad(longUser - longMe);
		var a =
		  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		  Math.cos(deg2rad(latMe)) *
			Math.cos(deg2rad(latUser)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return d;
    }

		return (
		<div>
			<div className="infos-container" key={uid}>
				<MainInfos user={user} isMyProfile={false} likedUsers={likedUsers} km={getDistanceBetweenUsers(latMe, longMe, latUser, longUser)}/>
				<Bio bio={bio} />
				<div className="tag-container">
					{ tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />) }
				</div>
				<LikeDislike uidUser={uid} likedUsers={likedUsers} dispatch={dispatch} />
				<BlockButton uidUser={uid} dispatch={dispatch} />
			</div> 
		    <Nav />
		</div>
	);
}

export default UserProfileDesktop;
