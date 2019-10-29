import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LikeDislike from './LikeDislike';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import Nav from "../Nav/Nav";
import './UserProfile.scss'

const UserProfile = props => {
	const { uid, firstname, lastname, bio, tags, likesCount, prefRadius, avatar } = props.user;

	return (
		<div>
			<div className="infos-container" key={uid}>
				<MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius} avatar={avatar} isMyProfile={props.isMyProfile}/>
				<Bio bio={bio}/>
				<div className="tag-container">
					{tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />)}
				</div>
				{ props.isMyProfile ? (
					<Link to="#" className="btn bg-bg btn-rond pref">
						<FontAwesomeIcon className="color-w" size="2x" icon="pen" />
					</Link>
				) : (
					<LikeDislike uidUser={uid} dispatch={props.dispatch} />
				)}
			</div>
			<Nav />
		</div>
	);
}

export default UserProfile;
