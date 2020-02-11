import React from 'react';
import { Link } from "react-router-dom";

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//import { store } from 'react-notifications-component';

//import Avatar from './Avatar.js';
import SliderShow from './SliderShow.js';
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

const MainInfos = ({ user, isMyProfile, km }) => {
	const { firstname, birthdate, elo, likesCount, likedUsers, lastVisite, images } = user;

	var kmArrondi = km*100;
	kmArrondi = Math.round(kmArrondi);
	kmArrondi = kmArrondi/100;

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
	//if (loading) console.log("waiting for user state change");
	//if (data) console.log("user state changed", data.userStateChanged.state);

	//console.log(user.firstname + ' ' + user.isConnected);
	//console.log(images);

	//console.log("username: ", user.firstname, "data: ", data, "isConnected: ", user.isConnected);
	const connected = (data ? data.userStateChanged.state : user.isConnected);

	return (
		<div className="pos-rel img-container">
			{/* <CommonStuff user={user}/> */}
			{/* <UsersState user={user}/> */}

			{ isMyProfile ? (
				<div>
					<div className="nav-user w-100">
						<Link to="/history" className="btn bg-r btn-rond more">
							<FontAwesomeIcon className="color-w" size="2x" icon="history" />
						</Link>
						<Link to="/profile/images" className="btn bg-bg btn-rond image">
							<FontAwesomeIcon className="color-w" size="2x" icon="image" />
						</Link>
					</div>
					<Link to="/preferences" className="btn bg-bg btn-rond pref">
						<FontAwesomeIcon className="color-w" size="2x" icon="pen" />
					</Link>
				</div>
			) : (
				<div className="nav-user w-100">
					<div>
						<FontAwesomeIcon className="icon white" icon={['fa', 'map-marker-alt']} />
						{/* <span className="icon-top">{prefRadius} Km</span> */}
						<span className="icon-top">{kmArrondi} Km</span>
					</div>
					<div>
						<FontAwesomeIcon className="icon white" icon={['far', 'heart']} />
						<span className="icon-top">{likesCount}</span>
					</div>
					<div>
						<div className={`rond ${connected ? "online" : "offline"}`}>
						</div>
					</div>
					<div className="lastVisite">
						{ connected ? null : <>dernière visite le: <br />{lastVisite}</> }
					</div>
				</div>
			)}
			{/* <Avatar src={avatar} /> */}
			<SliderShow src={images}/>
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
