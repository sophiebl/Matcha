import React, { useState } from 'react';
import './Banner.scss'

const Banner = ({ content }) => (
    <div className="banner">
        {content}
    </div>
);

const useBanner = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return [
    isShowing,
    toggle,
  ]
};

export default Banner;
export { useBanner };
