import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventsContext";
import { format } from "date-fns";
import axios from "axios";
import config from "../../config";

const EventCard = ({ event }) => {
  const { username } = useAuth();
  const { deleteEvent } = useEvents();

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(event._id);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  }, [event._id, deleteEvent]);

  const formatDateAsEST = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const estDate = new Date(year, month, day);
    return estDate;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time not specified";
    let [hours, minutes] = timeString.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const canSeeDeleteButton = (user_name) => {
    return user_name === "admin" || user_name === event.poster;
  };

  const eventDate = format(formatDateAsEST(event.date), "MMMM do, yyyy");
  const eventTime = formatTime(event.time);

  const [likes, setLikes] = useState(event.likes || 0); // State to track the number of likes
  const [liked, setLiked] = useState(false); // State to track if the user has liked the event

  const handleLikeToggle = async () => {
    const newLikedState = !liked; // Toggle the liked state

    try {
      // Send a request to update the like state in the backend
      // const response = await axios(
      //   `${config.apiUrl}/events/${event._id}/like`,
      //   {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ liked: newLikedState }),
      //   }
      // );

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${config.apiUrl}/events/${event._id}/like`,
        { headers: { Authorization: `Bearer ${token}` } },
        { liked: newLikedState }
      );

      if (response.ok) {
        const data = await response.json();

        // Update the likes and liked state based on the backend response
        setLikes(data.likes); // Update the likes count from the server
        setLiked(newLikedState); // Set the new liked state
      } else {
        console.error("Failed to update likes on the server");
      }
    } catch (error) {
      console.error("Error while toggling like:", error);
    }
  };

  return (
    <div key={event._id} className={styles.eventWrapper}>
      <div className={styles.imageContainer}>
        <img
          src={
            event.image ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
          }
          loading="lazy"
          alt={event.title}
        />
        <div className={styles.overlay}>
          <Link to={`/events/${event._id}`} className={styles.overlayLink}>
            <span>Open</span>
          </Link>
        </div>
      </div>
      <div className={styles.eventPosterDetails}>
        <p>Posted by {event.poster}</p>
      </div>
      {canSeeDeleteButton(username) && (
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete
        </button>
      )}
      <div className={styles.eventDetails}>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          <strong>Date & Time:</strong> {`${eventTime} on ${eventDate}`}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <div className={styles.tags}>
          {event.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.likeContainer}>
        <button className={styles.likeButton} onClick={handleLikeToggle}>
          {likes} {likes === 1 ? "Like" : "Likes"}{" "}
          {/* Display the number of likes */}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
