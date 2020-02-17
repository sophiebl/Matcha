import jwt_decode from 'jwt-decode';

const getToken = () => {
  try {
	return jwt_decode(localStorage.getItem('token'))
  }
  catch(error) {
	return null;
  }
}

const getCurrentUid = () => {
	const token = getToken();
	if (token !== null && token.uid !== null && (Date.now()/1000) < token.exp)
		return token.uid
	localStorage.removeItem('token');
	return null;
}

export { getToken, getCurrentUid};
