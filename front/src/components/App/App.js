import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Main from '../Main/Main';
import Login from '../Login/Login';
import Logout from '../Logout/Logout';
import Signup from '../Signup/Signup';
import Browse from '../Browse/Browse';
import MyProfile from '../Profile/MyProfile';
import MessagesIndex from '../MessagesIndex/MessagesIndex';
import Messages from '../Messages/Messages';
import Preferences from '../Preferences/Preferences';
import History from '../History/History';
import ProfileImages from '../ProfileImages/ProfileImages';
import EmailVerification from '../EmailVerification/EmailVerification';
import SendResetPassword from '../SendResetPassword/SendResetPassword';
import ResetPassword from '../ResetPassword/ResetPassword';
import { PublicRoute, PrivateRoute } from '../Routes/Routes';
//import Nav from "./components/Nav";
import './App.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCoffee, faTimes, faShoppingCart, faCartPlus, faMapMarkerAlt, faAngleLeft, faCog, faPen, faUsers, faPlus, faImage, faCheck, faHistory } from '@fortawesome/free-solid-svg-icons';
import { faStar, faHeart, faCommentAlt, faUser } from '@fortawesome/free-regular-svg-icons';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

import cookie from 'react-cookies';

library.add(faCheckSquare, faCoffee, faStar, faTimes, faShoppingCart, faHeart, faCartPlus, faCommentAlt, faUser, faMapMarkerAlt, faAngleLeft, faCheck, faCog, faPen, faUsers, faPlus, faImage, faHistory);

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
		credentials: 'include'
	}
});

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	link: ApolloLink.from([
		authLink,
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.forEach(({ message, locations, path }) =>
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
					),
				);
			if (networkError) console.log(`[Network error]: ${networkError}`);
		}),
		new HttpLink({
			uri: 'http://localhost:4000/graphql',
			credentials: 'include'
		}),
	]),
	cache: new InMemoryCache(),
});

const App = () => {
	return <>
		<ApolloProvider client={client}>
			<div className="App">
				<Router>
					<Switch>
						<PublicRoute exact path="/login" component={Login} />
						<Route exact path="/logout" component={Logout} />
						<PublicRoute exact path="/signup" component={Signup} />
						<PrivateRoute exact path="/browse" component={Browse}/>
						<PrivateRoute path="/browse/:username" component={(props) => { cookie.save('firstUsername', props.match.params.username, { path: '/' }); return <Redirect to="/browse"/> }}/>
						<PrivateRoute exact path="/profile" component={MyProfile} />
						<PrivateRoute path="/messages/:uid" component={Messages} />
						<PrivateRoute exact path="/messages" component={MessagesIndex} />
						<PrivateRoute exact path="/preferences" component={Preferences} />
						<PrivateRoute exact path="/history" component={History} />
						<PrivateRoute exact path="/profile/images" component={ProfileImages} />
						<PublicRoute path="/confirm/:confirmToken" component={EmailVerification} />
						<Route exact path="/reset" component={SendResetPassword} />
						<Route path="/reset/:resetToken" component={ResetPassword} />
						<PublicRoute exact path="/" component={Main} />

						<Redirect to="/browse" />
					</Switch>
				</Router>
			</div>
		</ApolloProvider>
		{/*<Nav/>*/}
	</>
}

export default App;
