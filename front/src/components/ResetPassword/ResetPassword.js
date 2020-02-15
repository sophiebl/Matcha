import React from 'react';
import { withRouter } from "react-router-dom";
import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

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
	const onSubmit = inputs => {
		//TODO: check passwordConfirmation
		resetPassword({
			variables: {
				password: inputs.password,
				resetToken: props.match.params.resetToken,
			}
		});
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
