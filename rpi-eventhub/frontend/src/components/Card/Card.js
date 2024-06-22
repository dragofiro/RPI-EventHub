import React from 'react';
import './Card.css';
// FOR CARD SIZE

function Card({ children, size }) {
    const sizeStyle = size === 'small' ? 'small' : size === 'medium' ? 'medium' : 'large';

    return (
        <div className={`card ${sizeStyle}`}>
            {children}
        </div>
    );
}

export default Card;
