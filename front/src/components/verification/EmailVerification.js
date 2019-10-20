import { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const EMAIL_VERIF = gql`
	mutation emailVerif($confirmToken: String!) {
		emailVerif(confirmToken: $confirmToken)
	}
`;

const EmailVerification = withRouter(({history, ...props}) => {
	const [emailVerif] = useMutation(EMAIL_VERIF,
		{
			onCompleted: data => {
				console.log(data);
				history.push("/login");
			},
			onError: data => {
				console.log(data);
			}
		}
	);

	useEffect(() =>	{
		emailVerif({
			variables: {
				confirmToken: props.match.params.confirmToken,
			}
		});
	}, [emailVerif, props.match.params.confirmToken]);

	return null;
});

export default EmailVerification;
