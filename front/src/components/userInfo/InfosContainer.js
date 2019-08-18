import React from 'react';
import Browse from '../browse/Browse';

const InfosContainer = () => {
    return (
        <div className="infos-container">
            <UserImg />
            <MainInfos />
            <Bio />
            <Tag />
            <div>
                <Button />
                <Button />
            </div>
        </div>
    );
}

export default InfosContainer;