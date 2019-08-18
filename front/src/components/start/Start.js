import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="start bg-desc">
      <h1>Matcha</h1>
      <div>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn">Sign up</Link>
      </div>
    </div>
  );
}

export default Start;