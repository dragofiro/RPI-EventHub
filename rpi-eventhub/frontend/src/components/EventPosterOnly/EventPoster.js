import React, { useCallback, useState, useEffect } from 'react';
import style from './EventPoster.module.css';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';

const EventPoster = ({ id, title, posterSrc, description, author, tags }) => {
  const { username } = useAuth();
  const { deleteEvent } = useEvents();
  const [likeCount, setLikeCount] = useState(0); 
  const [liked, setLiked] = useState(false); 

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  useEffect(() => {
    fetchLike();
    fetchUserLikeStatus();
  }, [id]); // Ensure `id` is included as a dependency

  const canSeeDeleteButton = (user_name) => {
    return user_name === 'admin' || user_name === author;
  };

  const handleLike = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/events/${id}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikeCount(response.data.likes);
      setLiked(!liked); // Toggle the liked state
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  }, [id, liked]);

  const fetchLike = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events/${id}/like`); 
      setLikeCount(response.data.likes); 
    } catch (error) {
      console.error('Failed to fetch likes', error); 
    }
  }, [id]);

  const fetchUserLikeStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/events/${id}/like/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Failed to fetch user like status:', error);
    }
  }, [id]);

  return (
    <div className={style.eventPosterContainer}>
      <img src={posterSrc} alt={title} className={style.eventPosterImg} />
      <div className={style.eventPosterDetails}>
        <h2 className={style.eventPosterTitle}>{title}</h2>
        <p className={style.eventPosterDescription}>{description}</p>
        {canSeeDeleteButton(username) && (
          <button onClick={handleDelete} className={`${style.deleteButton} btn-danger btn`}>
            Delete
          </button>
        )}
        <p>Posted by {author}</p>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
        <button onClick={handleLike} 
         className={`${style['like-button']} ${liked ? style.liked : style.unliked}`}>Like {likeCount}</button> 
      </div>
    </div>
  );
};

export default EventPoster;
