import React from 'react';
import { Link } from "react-router-dom";
import './Main.scss'

const Start = () => {
  return (
    <div className="start bg-desc">
      <h1>Matcha</h1>
      <div>
        <Link to="/login" className="btn">Login</Link>
        <p className="color-w">or</p>
        <Link to="/signup" className="btn">Sign up</Link>
      </div>
    </div>
  );
}

export default Start;
