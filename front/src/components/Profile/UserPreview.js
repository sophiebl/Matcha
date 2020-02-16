import React from 'react';

import MainInfos from './MainInfos';
import LikeDislike from './LikeDislike';
import Tag from './Tag';
import { Link } from "react-router-dom";
import './Profile.scss'

import UsersState from '../App/UsersState';

const UserPreview = ({ user, dispatch, userMe }) => {
	const { uid, tags, likedUsers, lat, long } = user;

	const latMe = parseFloat(userMe.me.lat);
	const longMe = parseFloat(userMe.me.long);
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
			<div className="infos-container infos-container-other-user" key={uid}>
				<MainInfos user={user} isMyProfile={false} likedUsers={likedUsers} km={getDistanceBetweenUsers(latMe, longMe, latUser, longUser)}/>
                <Link to={"/user/" + uid} className="link-to-profile">
                    Voir son profil
                </Link>
				<div className="tag-container">
					{ tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />) }
				</div>
				<LikeDislike uidUser={uid} likedUsers={likedUsers} dispatch={dispatch} />
				<UsersState user={user} dispatch={dispatch} userMe={userMe}/>
			</div>
		</div>
	);
}

export default UserPreview;
