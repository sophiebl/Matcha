import React from 'react';
import useForm from 'react-hook-form';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const GET_INFOS = gql`
    {
        me {
            uid
            firstname
            lastname
        }
    }
`;

const EDIT_INFOS = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)
    }
`;

const Settings = () => {
  const { settings, handleSubmit, errors } = useForm();
  const [updateSettings] = useMutation(EDIT_INFOS,
    {
      onCompleted: (data) => {
        console.log(data.login);
        //localStorage.setItem('token', data.login);
        //history.push("/browse");
      },
      onError: (data) => {
        console.log(data);
      }
    });
  const onSubmit = inputs => {
    /*updateSettings({
      variables: {
        username: inputs.username,
        password: inputs.password,
      }
    });*/
  };

  return (
    <div className="settings">
      <form method="POST" className="" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="username" placeholder="username" ref={settings} />
        <input type="password" name="password" placeholder="password" ref={settings} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Settings;