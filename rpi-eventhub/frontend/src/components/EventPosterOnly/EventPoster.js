import React, { useEffect, useRef } from 'react';
import './EventPoster.css';

const EventPoster = ({ title, posterSrc, description }) => {
    const posterRef = useRef(null);

    useEffect(() => {
        const handleLoad = () => {
            const gridAutoRows = 10; // The base row height set in your CSS
            const rowGap = 20; // The gap between rows set in your CSS
            const poster = posterRef.current;
            if (poster) {
                // Calculate the height of the image
                const imgHeight = poster.querySelector('img').offsetHeight;
                // Calculate the row span
                const rowSpan = Math.ceil((imgHeight + rowGap) / (gridAutoRows + rowGap));
                // Set the style for gridRowEnd
                poster.style.gridRowEnd = `span ${rowSpan}`;
            }
        };

        const img = posterRef.current.querySelector('img');
        img.addEventListener('load', handleLoad);

        // If the image is already loaded, call handleLoad directly
        if (img.complete) {
            handleLoad();
        }

        // Clean up the event listener when the component unmounts
        return () => {
            img.removeEventListener('load', handleLoad);
        };
    }, [posterSrc]); // Only re-run the effect if posterSrc changes

    return (
        <div className="event-poster-container" ref={posterRef}>
            <img src={posterSrc} alt={title} className="event-poster-img"/>
            <div className="event-poster-details">
                <h2 className="event-poster-title">{title}</h2>
                <p className="event-poster-description">{description}</p>
            </div>
        </div>
    );
};

export default EventPoster;
