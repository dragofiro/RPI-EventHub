import React from 'react';
import './EventPoster.css';

const EventPoster = ({ title, posterSrc, description }) => {
    return (
        <div className="event-poster-container">
            <img src={posterSrc} alt={title} className="event-poster-img" onLoad={(e) => {
                const aspectRatio = e.target.naturalWidth / e.target.naturalHeight;
                e.target.parentNode.style.maxWidth = `${aspectRatio * 100}vh`; // Set a max-width based on the image's aspect ratio and viewport height
            }}/>
            <div className="event-poster-details">
                <h2 className="event-poster-title">{title}</h2>
                <p className="event-poster-description">{description}</p>
            </div>
        </div>
    );
};


export default EventPoster;