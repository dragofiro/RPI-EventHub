import React, { useEffect, useState, useRef,useContext } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from "./Calendar.module.css";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';
const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [events, setEvents] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const calendarRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const parseDateAsEST = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    return new Date(year, month, day);
  };

  const getWeekRange = (startDate) => {
    const today = startDate || new Date();
    const currentDay = today.getDay();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - currentDay);

    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (6 - currentDay));

    const formatDate = (date) => {
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yy = date.getFullYear();
      return `${mm}/${dd}/${yy}`;
    };

    setWeekRange({
      start: formatDate(firstDayOfWeek),
      end: formatDate(lastDayOfWeek),
    });
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleWeekChange = (offset) => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(currentStartDate.getDate() + offset * 7);
    setCurrentStartDate(newStartDate);
    getWeekRange(newStartDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentStartDate(today);
    getWeekRange(today);
  };

  useEffect(() => {
    getWeekRange(currentStartDate);
    fetchEvents();
  }, [currentStartDate]);

  useEffect(() => {
    fetchEvents();
  }, [weekRange]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const filterEventsByDay = (day, firstDayOfWeek, lastDayOfWeek) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime || event.date);
      eventDate.setHours(0, 0, 0, 0);
      return (
        eventDate.getDay() === day &&
        eventDate >= firstDayOfWeek &&
        eventDate <= lastDayOfWeek
      );
    });
  };

  const loadAllImages = async () => {
    const images = calendarRef.current?.querySelectorAll("img");
    if (!images) return;
    await Promise.all(
      Array.from(images).map((img) => 
        new Promise((resolve, reject) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => {
              console.error(`Failed to load image: ${img.src}`);
              resolve(); 
            };
          }
        })
      )
    );
  };

const [isLoading, setIsLoading] = useState(false);

const captureCalendarScreenshot = async () => {
  try {
    setIsDisabled(true);
    setIsLoading(true);
    
    // Ensure all images are loaded
    await loadAllImages();
    
    if (calendarRef.current) {
      const canvas = await html2canvas(calendarRef.current, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `calendar-${weekRange.start}-to-${weekRange.end}.png`;
      link.click();
    }
  } catch (error) {
    console.error("Error capturing calendar screenshot:", error);
  } finally {
    setIsLoading(false);
    setTimeout(() => {
      setIsDisabled(false);
    }, 10000);
  }
};

  return (
    <div className={`outerContainer ${isDark ? 'text-white bg-[#120451]' : 'text-black bg-gradient-to-r from-red-400 via-yellow-200 to-blue-400'}`} data-theme={theme}>
      <NavBar />
      <div className={`${CalendarCSS.content} container-fluid containerFluid`}>
        <div className={CalendarCSS.heroSection}>
          <div className={CalendarCSS.title}></div>

          <div className={CalendarCSS.buttonWrapper}>
            <button 
              disabled={isDisabled} 
              onClick={captureCalendarScreenshot} 
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              {isLoading ? 'Saving...' : 'Save Calendar as Image'}
            </button>
          </div>

          <div className={CalendarCSS.grid} ref={calendarRef}>
            <div className={CalendarCSS.weeklyEvents}>
              <div className={CalendarCSS.navigationButtons}>
                <button onClick={() => handleWeekChange(-1)}>
                  Previous Week
                </button>
                <button onClick={goToToday}>Today</button>
                <button onClick={() => handleWeekChange(1)}>Next Week</button>
              </div>
              <h2>
                Week of {weekRange.start} - {weekRange.end}
              </h2>
              <div className={CalendarCSS.week}>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div className={CalendarCSS.day} key={day}>
                    <h3>
                      {
                        [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][day]
                      }
                    </h3>
                    {filterEventsByDay(
                      day,
                      parseDateAsEST(weekRange.start),
                      parseDateAsEST(weekRange.end)
                    ).length > 0 ? (
                      filterEventsByDay(
                        day,
                        parseDateAsEST(weekRange.start),
                        parseDateAsEST(weekRange.end)
                      ).map((event) => (
                        <Link to={`/events/${event._id}`} key={event._id}>
                          <div className={`${CalendarCSS.eventContainer} ${isDark ? 'border border-white' : ''}`}>
                            <h4 className={CalendarCSS.eventTitle}>
                              {event.title}
                            </h4>
                            {event.image ? (
                                <img
                                  src={`${config.apiUrl}/proxy/image/${event._id}`}
                                  alt={event.title}
                                  className={CalendarCSS.eventImage}
                                />

                            ) : (
                              <div
                                  className={CalendarCSS.eventImagePlaceholder}
                                  style={{ color: isDark ? "white" : "#666", backgroundColor: isDark ? "#333" : "#f0f0f0" }}
                              >
                              No image available
                              </div>
                            )}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p>No events</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className={CalendarCSS.hr} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;