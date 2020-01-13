import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

import { getCurrentUid } from '../../Helpers';

const LIKE_USER = gql`
	mutation likeUser($uid: ID!) {
		likeUser(uid: $uid)
	}
`;

const DISLIKE_USER = gql`
	mutation dislikeUser($uid: ID!) {
		dislikeUser(uid: $uid)
	}
`;

const LikeDislike = ({ uidUser, likedUsers, dispatch }) => {
	const [like] = useMutation(LIKE_USER,
		{
			onCompleted: data => dispatch({ type: 'like' }),
			onError: data => console.log(data),
		}
	);

	const [dislike] = useMutation(DISLIKE_USER,
		{
			onCompleted: data => dispatch({ type: 'dislike' }),
			onError: data => console.log(data),
		}
	);

	const LikeIcon = () => {
		if (likedUsers.find(u => u.uid === getCurrentUid()))
			return <FontAwesomeIcon className="color-liked" size="3x" icon={['far', 'star']} />
		else
			return <FontAwesomeIcon className="color-w" size="3x" icon={['far', 'star']} />
	}

	return (
		<div className="valign action-container">
			<div>
				<button className="bg-g btn-rond dislike" onClick={() => dislike({ variables: { uid: uidUser } })}>
					<FontAwesomeIcon className="color-w" size="3x" icon="times" />
				</button>
			</div>
			<div>
				<button className="bg-bg btn-rond like" onClick={() => like({ variables: { uid: uidUser } })}>
					<LikeIcon/>
				</button>
			</div>
		</div>
	);
}

export default LikeDislike;
