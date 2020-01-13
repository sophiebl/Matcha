import React from 'react';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import { getCurrentUid } from '../../Helpers';

const BLOCK_USER = gql`
	mutation blockUser($uid: ID!) {
		blockUser(uid: $uid)
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
				uid: uidUser,
			}
		});
	};


	const [report] = useMutation(REPORT_USER,
		{
			onCompleted: data => {
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
		<div className="block-container">
			<span className="txt-btn color-r" onClick={onClickBlock}>Bloquer | </span><span className="txt-btn color-r" onClick={onClickReport}>Signaler</span>
		</div>
	)
}

export default BlockButton;
