import React from 'react';
import { withRouter } from "react-router-dom";
import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import { store } from 'react-notifications-component';

const RESET_PASSWORD = gql`
	mutation resetPassword($password: String!, $resetToken: String!) {
		resetPassword(password: $password, resetToken: $resetToken)
	}
`;

const ResetPassword = withRouter(({history, ...props}) => {
	const { register, handleSubmit, errors } = useForm();
	const [resetPassword] = useMutation(RESET_PASSWORD,
		{
			onCompleted: data => {
				history.push("/login");
			},
			onError: data => {
				console.log(data);
			}
		}
	)
	const checkPwd = pwd => {
		if (pwd.length > 5) {
			if (pwd.match(/.*[0-9]+.*/) !== null) {
				if (pwd.match(/.*[A-Z]+.*/) !== null) {
					if (pwd.match(/.*[!@#-_$%^&*\(\){}\[\]:;<,>.?\/\\~`]+.*/) !== null)
						return true;
					else
						return false;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	const onSubmit = inputs => {
		//TODO: check passwordConfirmation
		var check = checkPwd(inputs.password);
		if (check) {
			resetPassword({
				variables: {
					password: inputs.password,
					resetToken: props.match.params.resetToken,
				}
			});
		} else {
			store.addNotification({
				title: "Votre mot de passe n'est pas assez sécurisé",
				message: "Votre mot de passe doit contenir au moins 1 chiffre, 1 majuscule et 1 caractere special et au moins 5 caracteres",
				type: 'danger',
				container: 'bottom-left',
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				dismiss: { duration: 3000 },
			})
		}
	};

	return (
		<form method="POST" className="pwdReset" onSubmit={handleSubmit(onSubmit)}>
			<input className="input-submit" type="password" name="password" placeholder="Password" ref={register({ required: true })} required/>
			{errors.password && 'Password is required.'}
			<input className="input-submit" type="password" name="passwordConfirmation" placeholder="Password confirmation" ref={register({ required: true })} required/>
			{errors.passwordConfirmation && 'Password confirmation is required.'}
			<button className="button-submit">Login</button>
		</form>
	)
});
export default ResetPassword;
