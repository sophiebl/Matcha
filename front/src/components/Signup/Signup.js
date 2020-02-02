import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import Banner, { useBanner } from '../Banner/Banner';

const SIGNUP = gql`
	mutation signup($firstname: String!,$lastname: String!, $email: String!, $username: String!, $password: String!, $lat: String!, $long: String!, $location: String!) {
		signup(firstname: $firstname, lastname: $lastname, email: $email, username: $username, password: $password, lat: $lat, long: $long, location: $location)
	}
`;

const Signup = withRouter(({history, ...props}) => {
	const [isClicked, setClicked] = useState(false);
	const [isLocation, setLocation] = useState({
		lat: null,
		long: null,
		location: null,
	});

	const showPosition = async position => {
        const obj = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lon=${position.coords.longitude}&lat=${position.coords.latitude}`
        );
		const data = await obj.json();
		console.log(data);
        let location = '';
        if (data.address.city_district)
            location = data.address.city_district;
        else
			location = data.address.city;
		console.log(location);
		setLocation({...isLocation,
			lat: data.lat,
			long: data.lon,
			location: location,
		});
    };
	const [showBanner, toggleBanner] = useBanner();
	const { register, handleSubmit /*, errors*/ } = useForm();
	const [signup] = useMutation(SIGNUP,
		{
		onCompleted: data => {
			localStorage.setItem('token', data.signup);
			toggleBanner();
		}
	});
	const onSubmit = inputs => {
		signup({
			variables: {
			firstname: inputs.firstname,
			lastname: inputs.lastname,
			email: inputs.email,
			username: inputs.username,
			password: inputs.password,
			lat: isLocation.lat,
			long: isLocation.long,
			location: isLocation.location,
			}
		});
	};

    const getLocation = () => {
        if (navigator.geolocation) {
			setClicked(true);
            const city = navigator.geolocation.getCurrentPosition(showPosition);
            console.log(city);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
	}
	
	const getLocationAnyway = () => {
		fetch("https://api.ipify.org/?format=json")
			.then(res => res.json())
			.then(data => {
			  fetch(`http://ip-api.com/json/${data.ip}`)
				.then(res => res.json())
				.then(data => {
					let lat = parseFloat(data.lat).toString();
					let long = parseFloat(data.lon).toString();
					let city = data.city;
					console.log(data);
					console.log(lat);
					console.log(long);
				  	setLocation({...isLocation,
						lat: lat,
						long: long,
						location: city,
					});
				})
				.catch(e => console.log(e));
			})
			.catch(e => console.log(e));
	}
	
	return (
		<div>
			<form method="POST" id="signup-banner" className="signup bg-desc" onSubmit={handleSubmit(onSubmit)}>
				<input type="text" name="firstname" placeholder="Prénom" ref={register({ required: true })} required/>
				<input type="text" name="lastname" placeholder="Nom" ref={register({ required: true })}/>
				<input type="text" name="username" placeholder="Username" ref={register({ required: true })} required/>
				<input type="text" name="email" placeholder="Email" ref={register({ required: true })} required/>
				<input type="password" name="password" placeholder="Mot de passe" ref={register({ required: true })} required/>
				<input type="password" name="password-confirmation" placeholder="Vérification du mot de passe" ref={register({ required: true })}/>
				<p className="txt-left f-m bio-title">Localisation</p>
				{!isClicked && (<button onClick={getLocation}>Get my location</button>)}
				{(isClicked === true) && (<span>{isLocation.location}</span>)}
				<input type="checkbox" onClick={getLocationAnyway}/>Je ne veux pas être géolocalisé
				<button>Sign up</button>
			</form>
			{showBanner && <Banner content="Please confirm your account by following the link in the mail we sent to you.">
			</Banner>}
		</div>
	);
});

export default Signup;
