import React from 'react';

import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

import Actions from './Actions'

const GET_USERS_ACTIONS = gql`
	{
		me {
			uid

			likedByUsers {
				uid
				username
			}

			visitedByUsers {
				uid
				username
			}

		}
	}
`;

const UsersActions = () => <Actions query={GET_USERS_ACTIONS} />

export default UsersActions;
