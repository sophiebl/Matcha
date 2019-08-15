import React, { useState } from 'react';
import Input from '../Input';

const Login = () => {
    return (
        <form className="login bg-desc">
            <Input type="text" placeholder="username"/>
            <Input type="password" placeholder="password"/>
            <button>Login</button>
        </form>
    )
}

export default Login;