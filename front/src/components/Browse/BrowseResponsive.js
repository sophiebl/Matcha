import React from 'react';
import BrowseDesktop from './BrowseDesktop';
import BrowseMobile from '../Browse/BrowseMobile';

// const BrowseResponsive = () => {

// }

// export default BrowseResponsive;

import { withBreakpoints } from 'react-breakpoints'
 
class Navigation extends React.Component {
  render() {
    const { breakpoints, currentBreakpoint } = this.props
    return (
      <div>
        {breakpoints[currentBreakpoint] > breakpoints.desktop ? (
          <BrowseDesktop />
        ) : (
          <BrowseMobile />
        )}
      </div>
    )
  }
}
 
export default withBreakpoints(Navigation)