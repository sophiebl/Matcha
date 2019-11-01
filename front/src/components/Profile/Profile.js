import React from 'react';

import UserProfile from './UserProfile';
import MyProfile   from './MyProfile';

const Profile = ({ user, isMyProfile, dispatch }) => {
	return isMyProfile ? (
		<UserProfile user={user} dispatch={dispatch} />
	) : (
		<MyProfile />
	);
};

export default Profile;
