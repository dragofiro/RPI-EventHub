import React, { useCallback } from 'react';
import './EventPoster.css';
import { useEvents } from '../../context/EventsContext';

const EventPoster = ({ id, title, posterSrc, description }) => {
  const { deleteEvent, likeEvent } = useEvents(); 

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

//Adding the like button
  const handleLike = useCallback(async () => {
    try {
      await likeEvent(id); // Assuming likeEvent is a function in your context that handles liking an event
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  }, [id, likeEvent]);

  return (
    <div className="event-poster-container">
      <img src={posterSrc} alt={title} className="event-poster-img" />
      <div className="event-poster-details">
        <h2 className="event-poster-title">{title}</h2>
        <p className="event-poster-description">{description}</p>
        <button onClick={handleDelete} className="delete-button">Delete</button>
        <button onClick={handleLike} className="like-button">Like</button>
      </div>
    </div>
  );
};

export default EventPoster;
