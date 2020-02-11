import React from 'react';
import { withBreakpoints } from 'react-breakpoints'

import BrowseDesktop from './BrowseDesktop';
import BrowseMobile from './BrowseMobile';

const Browse = (props) => {
  const { breakpoints, currentBreakpoint } = props

  return breakpoints[currentBreakpoint] > breakpoints.desktop ? <BrowseDesktop /> : <BrowseMobile />;
}

export default withBreakpoints(Browse);
