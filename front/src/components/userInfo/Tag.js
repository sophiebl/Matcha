import React from 'react';

const Tag = (props) => {
    return (
        <span className="tag">
           <span className="tagImg"></span> 
           {props.tagName}
        </span>
    );
}

export default Tag;