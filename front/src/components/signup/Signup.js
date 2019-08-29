import React from 'react';
import Input from '../Input';
import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const SIGNUP = gql`
  mutation signup($firstname: String!, $email: String!, $password: String!) {
	signup(firstname: $firstname, email: $email, password: $password)
  }
`;

const Signup = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
	console.log(data);
  };

  return (
	<form className="signup bg-desc" onSubmit={handleSubmit(onSubmit)}>
	  <Input type="text" name="lastname" placeholder="Nom" reff={register}/>
	  {errors.lastname && 'Last name is required.'}
	  <Input type="text" name="firstname" placeholder="Prénom" reff={register}/>
	  <Input type="text" name="username" placeholder="Username" reff={register}/>
	  <Input type="text" name="email" placeholder="Email" reff={register}/>
	  <Input type="password" name="password" placeholder="Mot de passe" reff={register}/>
	  <Input type="password" name="password-confirmation" placeholder="Vérification du mot de passe" reff={register}/>
	  <button>Sign up</button>
	</form>
  );
}

export default Signup;
