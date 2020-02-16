import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import useForm from 'react-hook-form';

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import Banner, { useBanner } from '../Banner/Banner';
import DatePicker from 'react-date-picker';

import { store } from 'react-notifications-component';

import '../Login/Login.scss'

const SIGNUP = gql`
	mutation signup($firstname: String!,$lastname: String!, $birthdate: String!, $email: String!, $username: String!, $password: String!, $lat: String!, $long: String!, $location: String!) {
		signup(firstname: $firstname, lastname: $lastname, birthdate: $birthdate, email: $email, username: $username, password: $password, lat: $lat, long: $long, location: $location)
	}
`;

const Signup = withRouter(({ history, ...props }) => {
	const [isClicked, setClicked] = useState(false);
	const [isLocation, setLocation] = useState({
		lat: null,
		long: null,
		location: null,
	});
	const [isBirthDate, setBirthDate] = useState(new Date());

	const onChangeBirthDate = event => {
		setBirthDate(
			event
		);
	}

	const showPosition = async position => {
		const obj = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lon=${position.coords.longitude}&lat=${position.coords.latitude}`
		);
		const data = await obj.json();
		let location = '';
		if (data.address.city_district)
			location = data.address.city_district;
		else
			location = data.address.city;
		setLocation({
			...isLocation,
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
				toggleBanner();
			},
			onError: data => {
				const err = data.message.split(':')[1].trim();
				if (err === "WrongPassword")
				  store.addNotification({
				    title: "Votre mot de passe n'est pas assez sécurisé",
				    message: "Votre mot de passe doit contenir au moins 1 chiffre, 1 majuscule et 1 caractere special et au moins 5 caracteres",
				    type: 'danger',
				    container: 'bottom-left',
				    animationIn: ["animated", "fadeIn"],
				    animationOut: ["animated", "fadeOut"],
				    dismiss: { duration: 3000 },
				  });
				else if (err === "UsernameOrMailAlreadyExists")
				store.addNotification({
				    title: "Username ou Mail deja utilise",
				    message: "Merci d'utiliser un autre username ou mail",
				    type: 'danger',
				    container: 'bottom-left',
				    animationIn: ["animated", "fadeIn"],
				    animationOut: ["animated", "fadeOut"],
				    dismiss: { duration: 3000 },
				  });
			  else
				store.addNotification({
				    title: "Erreur",
				    message: "Une erreur s'est produite",
				    type: 'danger',
				    container: 'bottom-left',
				    animationIn: ["animated", "fadeIn"],
				    animationOut: ["animated", "fadeOut"],
				    dismiss: { duration: 3000 },
				  });
			}
		});

	const checkPwd = pwd => {
		if (pwd.length > 5) {
			if (pwd.match(/.*[0-9]+.*/) !== null) {
				if (pwd.match(/.*[A-Z]+.*/) !== null) {
					if (pwd.match(/.*[!@#-_$%^&*\(\){}\[\]:;<,>.?\/\\~`]+.*/) !== null)
						return true;
					else
						return false;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	const onSubmit = inputs => {
		var check = checkPwd(inputs.password);
		if (check) {
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
					birthdate: isBirthDate.toString(),
				}
			});
		} else {
			store.addNotification({
				title: "Votre mot de passe n'est pas assez sécurisé",
				message: "Votre mot de passe doit contenir au moins 1 chiffre, 1 majuscule et 1 caractere special et au moins 5 caracteres",
				type: 'danger',
				container: 'bottom-left',
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				dismiss: { duration: 3000 },
			})
		}
	};

	const getLocation = () => {
		if (navigator.geolocation) {
			setClicked(true);
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}

	const [isFirst, setFirst] = useState(true);
	useEffect(() => {
		if (isFirst) {
			setFirst(false);
			fetch("https://api.ipify.org/?format=json")
				.then(res => res.json())
				.then(data => {
					fetch(`http://ip-api.com/json/${data.ip}`)
						.then(res => res.json())
						.then(data => {
							let lat = parseFloat(data.lat).toString();
							let long = parseFloat(data.lon).toString();
							let city = data.city;
							setLocation({
								...isLocation,
								lat: lat,
								long: long,
								location: city,
							});
						})
						.catch(e => console.log(e));
				})
				.catch(e => console.log(e));
		}
	}, [isFirst, setFirst, isLocation, setLocation]);

	return (
		<div className="bg-desc">
			<form method="POST" id="signup-banner" className="signup" onSubmit={handleSubmit(onSubmit)}>
				<h1>Sign up</h1>
				<input className="input-submit" type="text" name="firstname" placeholder="Prénom" ref={register({ required: true })} required />
				<input className="input-submit" type="text" name="lastname" placeholder="Nom" ref={register({ required: true })} />
				<input className="input-submit" type="text" name="username" placeholder="Username" ref={register({ required: true })} required />
				<input className="input-submit" type="text" name="email" placeholder="Email" ref={register({ required: true })} required />
				<input className="input-submit" type="password" name="password" placeholder="Mot de passe" ref={register({ required: true })} required />
				<input className="input-submit" type="password" name="password-confirmation" placeholder="Vérification du mot de passe" ref={register({ required: true })} />
				<DatePicker className="react-calendar" onChange={onChangeBirthDate} value={isBirthDate} />
				<div>
					<p>Localisation: </p>
					{!isClicked && (<button className="get-loc" onClick={getLocation}>Get my location</button>)}
					{(isClicked === true) && (<span>{isLocation.location}</span>)}
				</div>
				<button className="button-submit">Sign up</button>
			</form>
			{showBanner && <Banner content="Please confirm your account by following the link in the mail we sent to you.">
			</Banner>}
		</div>
	);
});

export default Signup;
