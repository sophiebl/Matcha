import React from 'react';

import InfosContainer from '../userInfo/InfosContainer';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const ME = gql`
    {
        me {
            uid
					  bio
					  gender
            firstname
            lastname
            likesCount
            prefDistance
            tags {
                uid
                name
            }
        }
    }
`;

const Browse = () => {
  const { loading, error, data } = useQuery(ME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error </p>;

  return (
    <div className="browse">
      <InfosContainer user={data.me}/>
    </div>
  );
};

export default Browse;
