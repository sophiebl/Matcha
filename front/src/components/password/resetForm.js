import React,  { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const PWD_RESET = gql`
  mutation emailverif($uid: String!, $confirmToken: String!) {
    emailverif(uid: $uid, confirmToken: $confirmToken)
  }
`;
const passwordReset = withRouter(({history, ...props}) => {
// const EmailVerification = () => {
  console.log(props);
  const [pwdReset] = useMutation(PWD_RESET,
      {
        onCompleted: (data) => {
          console.log(data);
          history.push("/login");
        },
        onError: (data) => {
          console.log(data);
          history.push("/login");
        }
      }
    )
  useEffect(() => {
      console.log(props.match.params);
      pwdReset({
        variables: {
          uid: props.match.params.uid,
          confirmToken: props.match.params.emailToken,
        }
      });
  });
  return (
    <form method="POST" className="pwdReset bg-desc" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="username" placeholder="username" ref={register} required/>
      {errors.username && 'Username is required.'}
        <input type="password" name="password" placeholder="password" ref={register} required/>
      {errors.password && 'Password is required.'}
        <button>Login</button>
    </form>
)
});
export default passwordReset;
