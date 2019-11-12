import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Avatar from './Avatar.js';

const MainInfos = ({ user, isMyProfile }) => {
	const { firstname, birthdate, likesCount, prefRadius, avatar } = user;
	const age = Math.abs(new Date(Date.now() - (new Date(birthdate))).getFullYear() - 1970);

	return (
		<div className="pos-rel img-container">
			{ isMyProfile ? (
				<div className="nav-user w-100">
					<Link to="/preferences" className="btn bg-r btn-rond more">
						<FontAwesomeIcon className="color-w" size="lg" icon="plus" />
					</Link>
					<Link to={{ pathname: '/uploadimages', state: {avatar}}} className="btn bg-bg btn-rond image">
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
						<div className="rond"></div>
					</div>
				</div>
			)}
			<Avatar src={avatar} />
			<div className="main-infos">
				<div className="mb-5">
					<h2>{firstname}</h2>
					<span className="f-base">Paris • {age} ans</span>
				</div>
				<div>
					<div></div>
				</div>
				<div>

				</div>
			</div>
		</div>
	);
}

export default MainInfos;
