import React/*, { useState }*/ from 'react';

const Login = () => {
    const onSubmit = inputs => {
        console.log(inputs);
    }


    return (
        <form method="POST" className="login bg-desc" /*onSubmit={handleSubmit(onSubmit)}*/>
            <input type="test" placeholder="username" />
            <input type="password" placeholder="password"/>
            <button>Login</button>
        </form>
    )
}

export default Login;
