import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { getCurrentUid } from '../../Helpers';
import Nav from "../Nav/Nav";

const GET_HISTORY = gql`
	{
		me {
			uid

			likedUsers {
				uid
				username
			}
			likedByUsers {
				uid
				username
			}

			visitedUsers {
				uid
				username
			}
			visitedUsers {
				uid
				username
			}

		}
	}
	`;

const History = () => {
	const { loading, error, data } = useQuery(GET_HISTORY, {
		variables: {
			'uid': getCurrentUid(),
		},
		fetchPolicy: 'cache-and-network',
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	const visitedUsers = data.me.visitedUsers;
	return visitedUsers.map(({ uid, username }) => (
		<div key={uid}>
			- {username}
		</div>
	));
}

export default History;
