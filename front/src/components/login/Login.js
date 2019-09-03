import React from 'react';
import useForm from 'react-hook-form';
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)
    }
`;

const Login = () => {
    const { register, handleSubmit, errors } = useForm();
    //console.log(register);
    //console.log(handleSubmit);
    //console.log(errors);
    const [login] = useMutation(LOGIN,
        {
            onCompleted: (data) => {
                console.log(data.login);
                localStorage.setItem('token', data.login);
            }
        });
    const onSubmit = inputs => {
        //console.log(inputs);
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
}

export default Login;
