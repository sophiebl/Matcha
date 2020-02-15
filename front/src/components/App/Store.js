import React, { createContext, useState, useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

export const StoreContext = createContext(null);

const ME = gql`
		{
		  me {
			uid
			notifications {
			  uid
			}
		  }
		}
`;

export default ({ children }) => {
  const [getCount, setCount] = useState(0);

  const { loading, error, data } = useQuery(ME);

  useEffect(() => {
	const onCompleted = (data) => {
		if (!data || !data.me || !data.me.notifications)
			setCount(0);
		else
			setCount(data.me.notifications.length);
	};
	const onError = (error) => console.log(error);
	if (onCompleted || onError)
	  if (onCompleted && !loading && !error)
		onCompleted(data);
	else if (onError && !loading && error)
	  onError(error);
  }, [loading, data, error]);


  const store = {
	notifs: { getCount, setCount },
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
