import React from 'react';
import { withRouter } from "react-router-dom";
import useForm from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import { Link } from "react-router-dom";

const LOGIN = gql`
		mutation login($username: String!, $password: String!) {
			login(username: $username, password: $password)
		}
`;

const Login = withRouter(({history, ...props}) => {
	const { register, handleSubmit, errors } = useForm();
	const [login] = useMutation(LOGIN,
		{
			onCompleted: data => {
				localStorage.setItem('token', data.login);
				history.push("/browse");
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
			<Link to="/reset" className="btn">resetPwdLink</Link>
		</div>
	)
});

export default Login;
