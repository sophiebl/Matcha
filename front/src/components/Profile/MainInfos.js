import React from 'react';
import { Link } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { store } from 'react-notifications-component';
import Avatar from './Avatar.js';
// import UsersState from '../App/UsersState';
// import CommonStuff from '../App/CommonStuff';
import { getCurrentUid } from '../../Helpers';

const USER_STATE_CHANGED = gql`
	subscription userStateChanged($uid: ID!) {
		userStateChanged(uid: $uid) {
			state
		}
	}
`;

const MainInfos = ({ user, isMyProfile }) => {
	const { firstname, birthdate, avatar, elo, likesCount, prefRadius, likedUsers, lastVisite } = user;
	const age = Math.abs(new Date(Date.now() - (new Date(birthdate))).getFullYear() - 1970);
	const LikeIcon = () => {
		return (likedUsers && likedUsers.find(u => u.uid === getCurrentUid())) ? (
			<div className="likedinfos txt-right color-liked">
				<span>Already liked you</span>
				<FontAwesomeIcon className="ph-5" size="3x" icon={['fas', 'check']} />
			</div>
		) : null
	}

	const { /*loading,*/ error, data } = useSubscription(USER_STATE_CHANGED, { variables: { uid: user.uid } });
	if (error) return <span>Subscription error!</span>;
	if (data) {
		console.log("NOOOOOOOOTIF");
		console.log(data);
	}

	console.log(user.firstname + ' ' + user.isConnected);

	return (
		<div className="pos-rel img-container">
			{/* <CommonStuff user={user}/> */}
			{/* <UsersState user={user}/> */}

			{ isMyProfile ? (
				<div className="nav-user w-100">
					<Link to="/history" className="btn bg-r btn-rond more">
						<FontAwesomeIcon className="color-w" size="2x" icon="history" />
					</Link>
					<Link to="/profile/images" className="btn bg-bg btn-rond image">
						<FontAwesomeIcon className="color-w" size="2x" icon="image" />
					</Link>
				</div>
			) : (
				<div className="nav-user w-100">
					<div>
						<FontAwesomeIcon className="icon white" icon={['fa', 'map-marker-alt']} />
						<span className="icon-top">{prefRadius} Km</span>
					</div>
					<div>
						<FontAwesomeIcon className="icon white" icon={['far', 'heart']} />
						<span className="icon-top">{likesCount}</span>
					</div>
					<div>
						<div className={`rond ${(data ? (data.userStateChanged.state ? "online" : "offline" ) : (user.isConnected ? "online" : "offline"))}`}></div>
					</div>
						<div className="lastVisite">
							{(data ? (data.userStateChanged.state ? "" : "dernière visite le: " ) : (user.isConnected ? "" : "dernière visite le: "))}
							<br/>
							{(data ? (data.userStateChanged.state ? "" : lastVisite ) : (user.isConnected ? "" : lastVisite))}
					</div>
					<div className={`${(data ? (data.userStateChanged.state ? 
						store.addNotification({
							title: 'Nouvelle connection',
							message: 'Un nouvel user vient de se connecter',
							type: 'default',
							container: 'bottom-left',
							animationIn: ["animated", "fadeIn"],
							animationOut: ["animated", "fadeOut"],
							dismiss: {
								duration: 3000 
							}
						}) 
						: "offline" ) : (user.isConnected ? "" : ""))}`}>
					</div>
				</div>
			)}
				<Avatar src={avatar} />
			<div className="main-infos valign50">
				<div className="mb-5">
					<h2>{firstname}</h2>
					<span className="f-base">Paris • {age} ans • {elo} pts</span>
				</div>
				<LikeIcon/>
			</div>
		</div>
	);
}

export default MainInfos;
