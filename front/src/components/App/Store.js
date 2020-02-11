import React, { createContext, useState } from 'react';

export const StoreContext = createContext(null);

export default ({ children }) => {
  const [getCount, setCount] = useState(0);

  const store = {
	  notifs: { getCount, setCount },
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
