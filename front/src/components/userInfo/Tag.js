import React from 'react';

const Tag = ({ tagName }) => {
    return (
        <span className="tag">
           <span className="tagImg"></span> 
           {tagName}
        </span>
    );
}

export default Tag;
