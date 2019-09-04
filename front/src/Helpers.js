import jwt_decode from 'jwt-decode';

const getCurrentUid = () => {
	try {
		return jwt_decode(localStorage.getItem('token')).uid
	}
	catch(error) {
		return null;
	}
}

export { getCurrentUid };