import React, { useState, useEffect } from 'react';
import './EventCard.css';

const EventCard = ({ title, posterSrc, description }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setDimensions({ width: img.width, height: img.height });
        };
        img.src = posterSrc;
    }, [posterSrc]);

    return (
        <div className="event-card" style={{ width: dimensions.width, height: dimensions.height }}>
            <div className="event-content">
                <div>
                    <h2 className="event-title">{title}</h2>
                    <img src={posterSrc} alt="Event Poster" className="event-poster"/>
                    <p className="event-description">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
