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
	if (token !== null && (Date.now()/1000) < token.exp)
		return token.uid
	return null;
}

export { getToken, getCurrentUid};
