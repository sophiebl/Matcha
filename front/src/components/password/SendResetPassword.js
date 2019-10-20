import React from 'react';
import { withRouter } from "react-router-dom";
import useForm from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const SEND_PWD_RESET = gql`
  mutation sendPwdReset($email: String!) {
    sendPwdReset(email: $email)
  }
`;

const SendResetPassword = withRouter(({history, ...props}) => {
  const { register, handleSubmit, errors } = useForm();
  const [pwdReset] = useMutation(SEND_PWD_RESET,
  {
		onCompleted: data => {
			alert('Merci de cliquer sur le lien dans le mail que vous avez recu.');
			history.push("/login");
		},
    onError: data => console.log(data),
  });
  const onSubmit = inputs => {
    pwdReset({
      variables: {
        email: inputs.email,
      }
    });
  };

  return (
    <form method="POST" className="resetPwdLink bg-desc" onSubmit={handleSubmit(onSubmit)}>
	    <input type="text" name="email" placeholder="Email" ref={register({ required: true })} required/>
      {errors.email && 'Email is required.'}
      <button>Reset password</button>
    </form>
  )
});

export default SendResetPassword;
