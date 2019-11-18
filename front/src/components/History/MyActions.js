import React from 'react';

import { gql } from "apollo-boost";

import Actions from './Actions'

const GET_MY_ACTIONS = gql`
	{
		me {
			uid

			likedUsers {
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

const MyActions = () => <Actions query={GET_MY_ACTIONS} />

export default MyActions;
