import React from 'react';
import InfosContainer from '../userInfo/InfosContainer';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const GET_USERS = gql`
{
    User {
        uid
        firstname
        lastname
        likesCount
        prefRadius
        tags {
            uid
            name
        }
    }
}
`;

const Browse = () => {
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error </p>;

    return (
        <div className="browse">
           { data.User.map((user) => <InfosContainer key={user.uid} user={user}/> ) }
        </div>
    );
}

export default Browse;