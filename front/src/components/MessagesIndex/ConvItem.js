import React from 'react';
import { Link } from 'react-router-dom';
import { gql } from "apollo-boost";
import { useSubscription } from '@apollo/react-hooks';
import './Messages.scss'

const USER_CONNECTED = gql`
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


const ConvItem = ( {convs, data }) => {
	console.log('convs in convItem', convs);	
	console.log('data', data);	

	const { err, success } = useSubscription(USER_CONNECTED, { variables: { uid: data.User[0].uid } });
	if (err) return <span>Subscription error!</span>;
	if (success) console.log(success);

	return convs.map(({ uid, lastMessage }) => (
		<div key={uid} className="msg-container">
			<Link to={"/messages/" + uid}>
				<div style={divStyle}>
					<div className="author-container">
						<div className="rond"></div>
						<img alt="user icon" className="img" style={imgStyle} src={lastMessage.author.avatar} />
						<div className={`rond ${(success && success.userStateChanged.state) ? "online" : "offline"}`}></div>
					</div>
					<div style={txtStyle}>
						<p style={nameStyle}>{lastMessage.author.firstname}</p>
						<p style={msgStyle}>{lastMessage.content}</p>
					</div>
				</div>
			</Link>
			<div style={hrStyle}></div>
		</div>
    ));

}

export default ConvItem;