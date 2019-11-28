import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCurrentUid } from '../../Helpers';

const LikeDislike = ({ uidUser, likedUsers, dispatch }) => {
	const LikeIcon = () => {
		if (likedUsers.find(u => u.uid === getCurrentUid()))
			return <FontAwesomeIcon className="color-liked" size="3x" icon={['far', 'star']} />
		else
			return <FontAwesomeIcon className="color-w" size="3x" icon={['far', 'star']} />
	}

	return (
		<div className="valign action-container">
			<div>
				<button className="bg-g btn-rond dislike" onClick={() => dispatch({ type: 'dislike' })}>
					<FontAwesomeIcon className="color-w" size="3x" icon="times" />
				</button>
			</div>
			<div>
				<button className="bg-bg btn-rond like" onClick={() => dispatch({ type: 'like' })}>
					<LikeIcon/>
				</button>
			</div>
		</div>
	);
}

export default LikeDislike;
