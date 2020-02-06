import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';

import { getCurrentUid } from '../../Helpers';

import './Messages.scss'

const USER_STATE_CHANGED = gql`
	subscription userStateChanged($uid: ID!) {
		userStateChanged(uid: $uid) {
			state
		}
	}
`;

const divStyle = {
	display: 'flex',
	flexDirection: 'row',
	marginLeft: '25px'
};

const imgStyle = {
	borderRadius: '50px',
	height: '50px',
	width: '50px'
};

const txtStyle = {
	textAlign: 'left',
	marginLeft: '20px',
};

const hrStyle = {
	display: 'block',
	height: '1px',
	border: 0,
	borderBottom: '1px solid rgb(108, 123, 138,0.2)',
	margin: '1em 0',
	padding: 0
};

const nameStyle = {
	color: 'black',
	fontSize: '15px',
	fontWeight: 'bold',
	marginTop: '5px',
	marginBottom: '2px'
};

const msgStyle = {
	color: '#27d5db',
	fontSize: '13px',
	margin: '0',
};


const ConvItem = ({ conv: { uid, members, lastMessage } }) => {
	const externalMembers = (members.filter(member => member.uid !== getCurrentUid()));
	const convTitle = externalMembers.map(member => member.username).join(', ');
	const convImage = externalMembers[0].avatar;

	const { error, data } = useSubscription(USER_STATE_CHANGED, { variables: { uid: externalMembers[0].uid } });
	if (error) return <span>Subscription error!</span>;
	if (data) {
		console.log("NOTIF : Quelqu'un vient de se connecter !!!!!");
		console.log(data);
	}
	return (
		<div key={uid} className="msg-container">
			<Link to={"/messages/" + uid}>
				<div style={divStyle}>
					<div className="author-container">
						<div className="rond"></div>
						<img alt="user icon" className="img" style={imgStyle} src={convImage} />
						<div className={`rond ${(data && data.userStateChanged.state) ? "online" : "offline"}`}></div>
					</div>
					<div style={txtStyle}>
						<p style={nameStyle}>{convTitle}</p>
						<p style={msgStyle}>{lastMessage.author.uid === getCurrentUid() ? "Vous : " : null}{lastMessage.content}</p>
					</div>
				</div>
			</Link>
			<div style={hrStyle}></div>
		</div>
    );

}

export default ConvItem;
