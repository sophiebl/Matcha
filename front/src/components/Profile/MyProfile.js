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
				username
				firstname
				lastname
				elo
				likesCount
				prefDistance
				tags {
					uid
					name
				}
				images {
					uid
					src
				}
				location
			}
		}
`;

const MyProfile = () => {
	const { loading, error, data } = useQuery(ME);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	const { uid, bio, tags, images, location } = data.me;

	return (
		<div>
			<div className="infos-container-my-profile" key={uid}>
				<MainInfos user={data.me} isMyProfile={true} userMe={images} meLocation={location} />
				<Bio content={bio} />
				<div className="tag-container">
					{ tags.map((tag, i) => <Tag key={i} tagName={tag.name} />) }
				</div>
				<div className="logout-container">
        			<Link to="/logout" className="color-r"><FontAwesomeIcon size="1x" icon="walking" />   Logout  <FontAwesomeIcon size="1x" icon="walking" /></Link>
				</div>
			</div>
			<Nav />
		</div>
	);
}

export default MyProfile;
