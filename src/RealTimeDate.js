import React, { useState, useEffect } from 'react';

const RealTimeDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(timer); // Cleanup the interval on unmounting
    };
  }, []);

  const getFormattedDate = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <p>{getFormattedDate(currentDate)}</p>
    </div>
  );
};

export default RealTimeDate;