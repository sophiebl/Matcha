import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import Nav from "../Nav/Nav";
import './Profile.scss'

const ME = gql`
		{
			me {
				uid
				bio
				birthdate
				avatar
				gender
				firstname
				lastname
				likesCount
				prefDistance
				tags {
					uid
					name
				}
			}
		}
`;

const MyProfile = () => {
	const { loading, error, data } = useQuery(ME);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	const { uid, bio, tags } = data.me;

	return (
		<div>
			<div className="infos-container" key={uid}>
				<MainInfos user={data.me} isMyProfile={true} />
				<Bio content={bio} />
				<div className="tag-container">
					{ tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />) }
				</div>
				<Link to="/preferences" className="btn bg-bg btn-rond pref">
					<FontAwesomeIcon className="color-w" size="2x" icon="pen" />
				</Link>
			</div>
			<Nav />
		</div>
	);
}

export default MyProfile;
