import React from 'react';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import LikeDislike from './LikeDislike';
import './UserProfile.scss'

const UserProfile = props => {
	const { uid, firstname, lastname, bio, tags, likesCount, prefRadius } = props.user;

	return (
		<div className="infos-container" key={uid}>
			<div>
				<MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius} />
				<Bio bio={bio}/>
				<div className="tag-container">
					{tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />)}
				</div>
				<LikeDislike uidUser={uid} dispatch={props.dispatch} />
			</div>
		</div>
	);
}

export default UserProfile;
