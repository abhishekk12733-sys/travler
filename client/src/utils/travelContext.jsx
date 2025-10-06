import { createContext, useContext, useState } from 'react';
import { mockTravelLogs, mockCommunityPosts, mockWishlist, mockCalendarEvents } from '../data/mockData';

const TravelContext = createContext();

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within TravelProvider');
  }
  return context;
};

export const TravelProvider = ({ children }) => {
  const [travelLogs, setTravelLogs] = useState(mockTravelLogs);
  const [communityPosts, setCommunityPosts] = useState([...mockTravelLogs, ...mockCommunityPosts]);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [calendarEvents, setCalendarEvents] = useState(mockCalendarEvents);

  const addTravelLog = (log) => {
    const newLog = {
      ...log,
      id: Date.now(),
      userId: 1,
      likes: 0,
      comments: 0,
      isPublic: log.isPublic || false
    };
    setTravelLogs(prev => [newLog, ...prev]);
    if (newLog.isPublic) {
      setCommunityPosts(prev => [newLog, ...prev]);
    }
    return newLog;
  };

  const updateTravelLog = (id, updates) => {
    setTravelLogs(prev => prev.map(log =>
      log.id === id ? { ...log, ...updates } : log
    ));
    setCommunityPosts(prev => prev.map(post =>
      post.id === id ? { ...post, ...updates } : post
    ));
  };

  const deleteTravelLog = (id) => {
    setTravelLogs(prev => prev.filter(log => log.id !== id));
    setCommunityPosts(prev => prev.filter(post => post.id !== id));
  };

  const toggleLike = (id) => {
    setCommunityPosts(prev => prev.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const addComment = (id, comment) => {
    setCommunityPosts(prev => prev.map(post =>
      post.id === id ? { ...post, comments: post.comments + 1 } : post
    ));
  };

  const addToWishlist = (place) => {
    const newItem = { ...place, id: Date.now() };
    setWishlist(prev => [...prev, newItem]);
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const addCalendarEvent = (event) => {
    const newEvent = { ...event, id: Date.now() };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const updateCalendarEvent = (id, updates) => {
    setCalendarEvents(prev => prev.map(event =>
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <TravelContext.Provider value={{
      travelLogs,
      communityPosts,
      wishlist,
      calendarEvents,
      addTravelLog,
      updateTravelLog,
      deleteTravelLog,
      toggleLike,
      addComment,
      addToWishlist,
      removeFromWishlist,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent
    }}>
      {children}
    </TravelContext.Provider>
  );
};
