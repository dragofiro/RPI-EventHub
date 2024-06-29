import React from 'react';
import Masonry from 'react-masonry-css';
import './PopularEvents.css';
import EventCard from '../EventCard/EventCard';

// Sample data for popular events
const events = [
    {
        id: 1,
        title: 'RPI Osu! Club Tournament',
        posterSrc: 'https://via.placeholder.com/304x494',
        description: 'Join us for the ultimate Osu! showdown on July 27th, 2024; from 6pm to 8pm at the McKinney Room, Union.',
    },

];

const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
};

function PopularEvents() {
    return (
        <div className="popular-events">
            <h2 className="header2">Popular Events</h2>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {events.map(event => (
                    <EventCard
                        key={event.id}
                        title={event.title}
                        posterSrc={event.posterSrc}
                        description={event.description}
                    />
                ))}
                </Masonry>
            </div>
        </div>
    );
}

export default PopularEvents;
