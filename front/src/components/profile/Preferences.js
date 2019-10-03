import React from 'react';
//import useForm from 'react-hook-form';

import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

//import { useQuery, useMutation } from '@apollo/react-hooks';
//import { gql } from "apollo-boost";

/*
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
*/


const Preferences = () => {
  /*
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
    //updateSettings({
    //  variables: {
    //    username: inputs.username,
    //    password: inputs.password,
    //  }
    //});
  };
  */

    const Handle = Slider.Handle;
    const handleDistance = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={`${value} km`}
                visible={true}
                placement="bottom"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    };
    const handleAge = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={`${value} ans`}
                visible={true}
                placement="bottom"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    };

    const wrapperStyle = { width: '80%', margin: 30 };

    const Radio = ({ name, label, isSelected, onCheckboxChange }) => (
        <div className="form-check">
            <label>
                <input
                    type="radio"
                    name={name}
                    defaultChecked={isSelected}
                    onChange={onCheckboxChange}
                    className="form-check-input"
                />
                {label}
            </label>
        </div>
    );

  return (
    <div className="settings">
        <h2>Preferences</h2>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <div>
                <h4>Vous etes</h4>
                <Radio name="gender" label="Homme">Homme</Radio>
                <Radio name="gender" label="Femme">Femme</Radio>
                <Radio name="gender" label="Non binaire">Non binaire</Radio>
            </div>
            <div style={{width: '15px'}}> </div>
            <div>
                <h4>Vous cherchez</h4>
                <Radio name="orientation" label="Homme">Homme</Radio>
                <Radio name="orientation" label="Femme">Femme</Radio>
                <Radio name="orientation" label="Non binaire">Non binaire</Radio>
            </div>
        </div>

        <div style={wrapperStyle}>
            <p>Distance</p>
            <Slider min={5} max={200} defaultValue={20} handle={handleDistance} step={5} />
        </div>
        <div style={wrapperStyle}>
            <p>Age</p>
            <Range min={18} max={80} defaultValue={[25, 35]} pushable={1} handle={handleAge} />
        </div>
    </div>
  );
}

export default Preferences;
