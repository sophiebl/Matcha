import React,  { useEffect } from 'react';
import useForm from 'react-hook-form';
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const PWD_RESET = gql`
  mutation pwdReset($email: String!) {
    pwdReset(email: $email)
  }
`;

//const ResetPwdLink = () => {
const ResetPwdLink = withRouter(({history, ...props}) => {
  const { resetPwdLink, handleSubmit, errors } = useForm();
  const [pwdReset] = useMutation(PWD_RESET,
  {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (data) => {
      console.log(data);
      console.log('Votre email n\'a PASSSSS ete envoye');
    }
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
	    <input type="text" name="email" placeholder="Email" ref={resetPwdLink} required/>
      {errors.email && 'Email is required.'}
      <button>Reset password</button>
    </form>
  )
});

export default ResetPwdLink;