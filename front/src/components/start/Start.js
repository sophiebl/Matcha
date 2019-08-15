import React, { useState } from 'react';
import Button from '../Button';

  const Start = () => {
    return (
      <div className="start bg-desc">
        <h1>Matcha</h1>
        <div>
          <Button start="Login"/>
          <Button start="Sign up"/>
        </div>
      </div>
    );
}

export default Start;