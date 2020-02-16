import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
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
import Notifications from '../Notifications/Notifications';
import ProfileImages from '../ProfileImages/ProfileImages';
import EmailVerification from '../EmailVerification/EmailVerification';
import SendResetPassword from '../SendResetPassword/SendResetPassword';
import ResetPassword from '../ResetPassword/ResetPassword';
import UserProfileDesktop from '../Profile/UserProfileDesktop';
import AdminReports from '../Admin/Reports';

//TODO: query me to check token

const Router = () => (
	<BrowserRouter>
		<Switch>
			<PublicRoute exact path="/login" component={Login} />
			<PrivateRoute exact path="/logout" component={Logout} />
			<PublicRoute exact path="/signup" component={Signup} />
			<PrivateRoute exact path="/browse" component={Browse}/>
			<PrivateRoute exact path="/profile" component={MyProfile} />
			<PrivateRoute path="/messages/:uid" component={Messages} />
			<PrivateRoute path="/user/:uid" component={UserProfileDesktop} />
			<PrivateRoute exact path="/messages" component={MessagesIndex} />
			<PrivateRoute exact path="/notifications" component={Notifications} />
			<PrivateRoute exact path="/preferences" component={Preferences} />
			<PrivateRoute exact path="/history" component={History} />
			<PrivateRoute exact path="/profile/images" component={ProfileImages} />
			<PublicRoute path="/confirm/:confirmToken" component={EmailVerification} />
			<Route exact path="/reset" component={SendResetPassword} />
			<Route path="/reset/:resetToken" component={ResetPassword} />
			<Route exact path="/admin/reports" component={AdminReports} />
			<PublicRoute exact path="/" component={Main} />

			<Redirect to="/browse" />
		</Switch>
	</BrowserRouter>
);

export default Router;
