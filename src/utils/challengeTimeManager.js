import { useState, useEffect } from 'react';

export const useChallengeTimer = (challenge, completedDays) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [canMarkComplete, setCanMarkComplete] = useState(false);

  useEffect(() => {
    const checkAvailability = () => {
      if (!challenge?.startDate) return;

      const start = new Date(challenge.startDate);
      const now = new Date();
      const lastCompletedDate = completedDays.length > 0 
        ? new Date(completedDays[completedDays.length - 1].date || completedDays[completedDays.length - 1]) 
        : start;

      // Calculate when the next day can be marked
      const nextAvailableDate = new Date(lastCompletedDate);
      nextAvailableDate.setMinutes(nextAvailableDate.getMinutes() + 5); // Using 5 minutes for testing

      const timeDiff = nextAvailableDate - now;

      if (timeDiff <= 0) {
        setCanMarkComplete(true);
        setTimeLeft('');
      } else {
        setCanMarkComplete(false);
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}min ${seconds}sec to mark as completed`);
      }
    };

    // Initial check
    checkAvailability();

    // Set up interval
    const timer = setInterval(checkAvailability, 1000);

    return () => clearInterval(timer);
  }, [challenge?.startDate, completedDays]);

  return {
    timeLeft,
    canMarkComplete
  };
};

// Constants for time intervals
export const TIME_INTERVALS = {
  TESTING: 5 * 60 * 1000, // 5 minutes in milliseconds
  PRODUCTION: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

// Helper functions
export const getNextAvailableDate = (lastCompletedDate) => {
  const nextDate = new Date(lastCompletedDate);
  nextDate.setMinutes(nextDate.getMinutes() + 5); // Using 5 minutes for testing
  return nextDate;
};

export const formatTimeLeft = (timeDiff) => {
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  return `${minutes}min ${seconds}sec to mark as completed`;
}; 