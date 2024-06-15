import React from 'react';
import './PinterestLayout.css';

function PinterestLayout({ children }) {
    return (
        <div className="pin-container">
            {children}
        </div>
    );
}

export default PinterestLayout;
