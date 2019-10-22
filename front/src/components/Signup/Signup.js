import React from "react";
import { withRouter } from "react-router-dom";

import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import Banner, { useBanner } from '../Banner/Banner';

const SIGNUP = gql`
	mutation signup($firstname: String!,$lastname: String!, $email: String!, $username: String!, $password: String!) {
		signup(firstname: $firstname, lastname: $lastname, email: $email, username: $username, password: $password)
	}
`;

const Signup = withRouter(({history, ...props}) => {
	const [showBanner, toggleBanner] = useBanner();
	const { register, handleSubmit /*, errors*/ } = useForm();
	const [signup] = useMutation(SIGNUP,
		{
		onCompleted: data => {
			localStorage.setItem('token', data.signup);
			toggleBanner();
		}
	});
	const onSubmit = inputs => {
		signup({
			variables: {
			firstname: inputs.firstname,
			lastname: inputs.lastname,
			email: inputs.email,
			username: inputs.username,
			password: inputs.password,
			}
		});
	};
	
	return (
		<div>
			<form method="POST" id="signup-banner" className="signup bg-desc" onSubmit={handleSubmit(onSubmit)}>
				<input type="text" name="firstname" placeholder="Prénom" ref={register({ required: true })} required/>
				<input type="text" name="lastname" placeholder="Nom" ref={register({ required: true })}/>
				<input type="text" name="username" placeholder="Username" ref={register({ required: true })} required/>
				<input type="text" name="email" placeholder="Email" ref={register({ required: true })} required/>
				<input type="password" name="password" placeholder="Mot de passe" ref={register({ required: true })} required/>
				<input type="password" name="password-confirmation" placeholder="Vérification du mot de passe" ref={register({ required: true })}/>
				<button>Sign up</button>
			</form>
			{showBanner && <Banner content="Please confirm your account by following the link in the mail we sent to you.">
			</Banner>}
		</div>
	);
});

export default Signup;
