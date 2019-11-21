import React from 'react';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import { getCurrentUid } from '../../Helpers';

const BLOCK_USER = gql`
	mutation AddUserBlockedUsers($from: _UserInput!, $to: _UserInput!) {
		AddUserBlockedUsers(from: $from, to: $to) {
			to {
				uid
			}
		}
	}
`;

const REPORT_USER = gql`
	mutation reportUser($uid: ID!) {
		reportUser(uid: $uid) {
			uid
		}
	}
`;

const BlockButton = ({ uidUser, dispatch }) => {
	const [block] = useMutation(BLOCK_USER,
		{
			onCompleted: data => {
				console.log('blocked');
				dispatch({ type: 'dislike' });
			},
			onError: data => console.log(data),
		});

	const onClickBlock = () => {
		block({
			variables: {
				from: { uid: getCurrentUid() },
				to: { uid: uidUser },
			}
		});
	};


	const [report] = useMutation(REPORT_USER,
		{
			onCompleted: data => {
				console.log('reported');
				dispatch({ type: 'dislike' });
			},
			onError: data => console.log(data),
		});

	const onClickReport = () => {
		report({
			variables: {
				uid: uidUser,
			}
		});
	};

	return (
		<div>
			<a href="#0" className="txt-btn color-r" onClick={onClickBlock}>Bloquer</a> - <a href="#0" className="txt-btn color-r" onClick={onClickReport}>Signaler</a>
		</div>
	)
}

export default BlockButton;
