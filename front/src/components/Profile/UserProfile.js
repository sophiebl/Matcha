import React from 'react';

import LikeDislike from './LikeDislike';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import Nav from "../Nav/Nav";
import './Profile.scss'

const UserProfile = ({ user, dispatch }) => {
	const { uid, firstname, lastname, bio, tags, likesCount, prefRadius, avatar } = user;

	return (
		<div>
			<div className="infos-container" key={uid}>
				<MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius} avatar={avatar} isMyProfile={false} />
				<Bio bio={bio} />
				<div className="tag-container">
					{ tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />) }
				</div>
				<LikeDislike uidUser={uid} dispatch={dispatch} />
			</div>
			<Nav />
		</div>
	);
}

export default UserProfile;
