import React,  { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const EMAIL_VERIF = gql`
  mutation emailverif($uid: String!, $confirmToken: String!) {
    emailverif(uid: $uid, confirmToken: $confirmToken)
  }
`;
const EmailVerification = withRouter(({history, ...props}) => {
// const EmailVerification = () => {
  console.log(props);
  const [emailverif] = useMutation(EMAIL_VERIF,
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
      emailverif({
        variables: {
          uid: props.match.params.uid,
          confirmToken: props.match.params.emailToken,
        }
      });
            // history.push("/login");
  });
  // console.log("props", props.match.params, props.location);
  return (
    <h1>Ici</h1>
  ) 
// }
});
export default EmailVerification;
