import React from 'react';
import { withRouter } from "react-router-dom";

import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import Banner from '../Banner/Banner';
import useBanner from '../Banner/useBanner';

const SIGNUP = gql`
  mutation signup($firstname: String!,$lastname: String!, $email: String!, $username: String!, $password: String!) {
	  signup(firstname: $firstname, lastname: $lastname, email: $email, username: $username, password: $password)
  }
`;

const Signup = withRouter(({history, ...props}) => {
	const { register, handleSubmit /*, errors*/ } = useForm();
  const [signup] = useMutation(SIGNUP,
	{
	  onCompleted: data => {
		 localStorage.setItem('token', data.signup);
		 history.push("/");
		 //toggle();
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

	const {isShowing, toggle} = useBanner();
	
  return (
	  <div>
		  <form method="POST" id="signup-banner" className="signup bg-desc" onSubmit={handleSubmit(onSubmit)}>
		    <input type="text" name="firstname" placeholder="Prénom" ref={register} required/>
		    <input type="text" name="lastname" placeholder="Nom" ref={register}/>
		    <input type="text" name="username" placeholder="Username" ref={register} required/>
		    <input type="text" name="email" placeholder="Email" ref={register} required/>
		    <input type="password" name="password" placeholder="Mot de passe" ref={register} required/>
		    <input type="password" name="password-confirmation" placeholder="Vérification du mot de passe" ref={register}/>
		    <button onClick={toggle}>Sign up</button>
		  </form>
		  	<Banner content="Please confirm your account by follow the link in the mail we sent to you."
    	    isShowing={isShowing}
    	    hide={toggle}>
				</Banner>
	  </div>
  );
});

export default Signup;