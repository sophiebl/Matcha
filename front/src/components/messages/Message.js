import React/*, { useState }*/ from 'react';

const Message = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
	    <p>message</p>
      </div>
    </ApolloProvider>
  );
}

export default Message;
