import React from 'react';

import { gql } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';

const BLOCK_USER = gql`
	mutation AddUserBlockedUsers($from: User!, $to: User!) {
		AddUserBlockedUsers(from: $from, to: $to) {
			to {
				uid
					blockedByUsers {
					uid
					username
				}
			}
		}
	}
`;

const ReportButton = ({ uidUser }) => {

	return (
		<button className="txt-btn color-red" onClick={() => null}>
			Signaler l'utilisateur
		</button>
	);
}

export default ReportButton;
