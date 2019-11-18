import React, { useEffect } from 'react';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import MainInfos from './MainInfos';
import Bio from './Bio';
import LikeDislike from './LikeDislike';
import Tag from './Tag';
import Nav from "../Nav/Nav";
import './Profile.scss'

const VISIT_PROFILE = gql`
	mutation visitProfile($uid: ID!) {
		visitProfile(uid: $uid) {
			visitedUsers {
				username
			}	
		}
	}
`;

const UserProfile = ({ user, dispatch }) => {
	const { uid, bio, tags, likedUsers } = user;

	const [visitProfile] = useMutation(VISIT_PROFILE, {
		onError: data => console.log(data),
	});

	useEffect(() =>	{
		visitProfile({
			variables: {
				uid: uid,
			}
		});
	}, [visitProfile, uid]);

	return (
		<div>
			<div className="infos-container" key={uid}>
				<MainInfos user={user} isMyProfile={false} />
				<Bio bio={bio} />
				<div className="tag-container">
					{ tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />) }
				</div>
				<LikeDislike uidUser={uid} likedUsers={likedUsers} dispatch={dispatch} />
			</div>
			<Nav />
		</div>
	);
}

export default UserProfile;
