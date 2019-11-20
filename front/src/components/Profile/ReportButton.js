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

const BlockButton = ({ uidUser, dispatch }) => {
	const [block] = useMutation(BLOCK_USER,
		{
			onCompleted: data => {
				console.log('blocked');
				dispatch({ type: 'dislike' });
			},
			onError: data => console.log(data),
		});

	const clickBlock = () => {
		block({
			variables: {
				from: { uid: getCurrentUid() },
				to: { uid: uidUser },
			}
		});
	};


	const [report] = useMutation(BLOCK_USER,
		{
			onCompleted: data => {
				console.log('reported (wip)');
				dispatch({ type: 'dislike' });
			},
			onError: data => console.log(data),
		});

	const clickReport = () => {
		report({
			variables: {
				from: { uid: getCurrentUid() },
				to: { uid: uidUser },
			}
		});
	};

	return (
		<div>
			<a className="txt-btn color-r" onClick={clickBlock}>Bloquer</a> - <a className="txt-btn color-r" onClick={clickReport}>Signaler</a>
		</div>
	)
}

export default BlockButton;
