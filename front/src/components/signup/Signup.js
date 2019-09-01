import React from 'react';
import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const SIGNUP = gql`
  mutation signup($firstname: String!, $email: String!, $username: String!, $password: String!) {
	signup(firstname: $firstname, email: $email, username: $username, password: $password)
  }
`;

const Signup = () => {
  const { register, handleSubmit, errors } = useForm();
  console.log(register);
  console.log(handleSubmit);
  const [signup] = useMutation(SIGNUP,
	{
	  onCompleted: (data) => {
		console.log(data.signup);
		localStorage.setItem('token', data.signup);
	  }
	});
  const onSubmit = inputs => {
	console.log(inputs);
	signup({
	  variables: {
		firstname: inputs.firstname,
		email: inputs.email,
		username: inputs.username,
		password: inputs.password,
	  }
	});
  };

  return (
	<form method="POST" className="signup bg-desc" onSubmit={handleSubmit(onSubmit)}>
	  <input type="text" name="lastname" placeholder="Nom" ref={register}/>
	  {errors.lastname && 'Last name is required.'}
	  <input type="text" name="firstname" placeholder="Prénom" ref={register} required/>
	  <input type="text" name="username" placeholder="Username" ref={register} required/>
	  <input type="text" name="email" placeholder="Email" ref={register} required/>
	  <input type="password" name="password" placeholder="Mot de passe" ref={register} required/>
	  <input type="password" name="password-confirmation" placeholder="Vérification du mot de passe" ref={register}/>
	  <button>Sign up</button>
	</form>
  );
}

export default Signup;
