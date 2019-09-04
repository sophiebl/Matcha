import React from 'react';
import { withRouter } from "react-router-dom";
import useForm from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)
    }
`;

const Login = withRouter(({history, ...props}) => {
    const { register, handleSubmit, errors } = useForm();
    const [login] = useMutation(LOGIN,
        {
            onCompleted: (data) => {
                console.log(data.login);
                localStorage.setItem('token', data.login);
                history.push("/browse");
                console.log(history);
            },
            onError: (data) => {
                console.log(data);
            }
        });
    const onSubmit = inputs => {
        login({
            variables: {
                username: inputs.username,
                password: inputs.password,
            }
        });
    };


    return (
        <form method="POST" className="login bg-desc" onSubmit={handleSubmit(onSubmit)}>
            <input type="text" name="username" placeholder="username" ref={register} required/>
	        {errors.username && 'Username is required.'}
            <input type="password" name="password" placeholder="password" ref={register} required/>
	        {errors.password && 'Password is required.'}
            <button>Login</button>
        </form>
    )
});

export default Login;
