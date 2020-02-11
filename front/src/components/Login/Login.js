import React, {useState, useEffect} from 'react';
import { withRouter, Link } from "react-router-dom";

import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import './Login.scss'

const LOGIN = gql`
		mutation login($username: String!, $password: String!, $lat: String!, $long: String!, $location: String!) {
			login(username: $username, password: $password, lat: $lat, long: $long, location: $location)
		}
`;

const Login = withRouter(({history, ...props}) => {
	const { register, handleSubmit, errors } = useForm();
	const [isLocation, setLocation] = useState({
		lat: 'null',
		long: 'null',
		location: 'null',
	});

	useEffect(() => {
		fetch("https://api.ipify.org/?format=json")
			.then(res => res.json())
			.then(data => {
			  fetch(`http://ip-api.com/json/${data.ip}`)
				.then(res => res.json())
				.then(data => {
					let lat = parseFloat(data.lat).toString();
					let long = parseFloat(data.lon).toString();
					let city = data.city;
				  	setLocation({...isLocation,
						lat: lat,
						long: long,
						location: city,
					});
				})
				.catch(e => console.log(e));
			})
			.catch(e => console.log(e));
	}, [isLocation, setLocation]);

	const [login] = useMutation(LOGIN,
		{
			onCompleted: data => {
				localStorage.setItem('token', data.login);
				history.push("/browseResponsive");
				//window.location.reload();
			},
			onError: data => {
				switch (data.message.split(':', 2)[1].trim()) {
					case 'UnknownUsername':
						alert("Nom d'utilisateur inconnu.");
						break;
					case 'InvalidPassword':
						alert('Mot de passe incorrect.');
						break;
					case 'EmailNotConfirmed':
						alert('Merci de confirmer votre email avant de vous connecter.');
						break;
					case 'UserBanned':
						alert('Vous etes banni(e) ! RIP');
						break;
					default:
						console.log(data);
				}
			}
		});
		
	const onSubmit = inputs => {
		login({
			variables: {
				username: inputs.username,
				password: inputs.password,
				lat: isLocation.lat,
				long: isLocation.long,
				location: isLocation.location,
			}
		});
	};

	return (
		<div>
			<form method="POST" className="login bg-desc" onSubmit={handleSubmit(onSubmit)}>
				<input type="text" name="username" placeholder="username" ref={register({ required: true })} required/>
				{errors.username && 'Username is required.'}
				<input type="password" name="password" placeholder="password" ref={register({ required: true })} required/>
				{errors.password && 'Password is required.'}
				<button>Login</button>
			</form>
			<Link to="/reset" className="btn">Forgot password</Link>
		</div>
	)
});

export default Login;
