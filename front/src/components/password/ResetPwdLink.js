import React from 'react';
import useForm from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from "react-router-dom";

const PWD_RESET = gql`
  mutation pwdReset($email: String!) {
    pwdReset(email: $email)
  }
`;

//const ResetPwdLink = () => {
const ResetPwdLink = withRouter(({history, ...props}) => {
  const { register, handleSubmit, errors } = useForm();
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
	    <input type="text" name="email" placeholder="Email" ref={register({ required: true })} required/>
      {errors.email && 'Email is required.'}
      <button>Reset password</button>
    </form>
  )
});

export default ResetPwdLink;