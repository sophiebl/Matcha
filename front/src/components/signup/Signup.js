import React/*, { useState }*/ from 'react';
import Input from '../Input';

const Signup = () => {
    return (
        <form className="signup bg-desc">
            <Input type="text" placeholder="Nom"/>
            <Input type="text" placeholder="Prénom"/>
            <Input type="text" placeholder="Username"/>
            <Input type="text" placeholder="Email"/>
            <Input type="password" placeholder="Mot de passe"/>
            <Input type="password" placeholder="Vérification du mot de passe"/>
            <button>Sign up</button>
        </form>
    );
}

export default Signup;
