import React, { useState, useEffect, useCallback } from 'react';
import './EventPoster.css';
import { useEvents } from '../../context/EventsContext';

const EventPoster = ({ id, title, posterSrc, description }) => {
  const { deleteEvent } = useEvents();
  const [likes, setLikes] = useState(0); // State to hold likes count
  const [showLikes, setShowLikes] = useState(false); // State to show/hide likes count

  // Fetch the initial likes count from the backend
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/events/${id}/likes`);
        const data = await response.json();
        setLikes(data.likes);
      } catch (error) {
        console.error('Failed to fetch likes:', error);
      }
    };
    fetchLikes();
  }, [id]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  const handleLike = useCallback(async () => {
    try {
      const response = await fetch(`/events/${id}/like`, { method: 'POST' });
      const data = await response.json();
      setLikes(data.likes); 
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  }, [id]);

  return (
    <div className="event-poster-container">
      <img src={posterSrc} alt={title} className="event-poster-img" />
      <div className="event-poster-details">
        <h2 className="event-poster-title">{title}</h2>
        <p className="event-poster-description">{description}</p>
        <button onClick={handleDelete} className="delete-button">Delete</button>
        <button
          onClick={handleLike}
          className="like-button"
          onMouseEnter={() => setShowLikes(true)}
          onMouseLeave={() => setShowLikes(false)}
        >
          Like
          {showLikes && <span className="likes-count">{likes}</span>}
        </button>
      </div>
    </div>
  );
};

export default EventPoster;
