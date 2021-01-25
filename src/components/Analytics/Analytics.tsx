import React, { useEffect } from 'react';
import Nucleus from 'nucleus-nodejs';

// Gives us splat tracking and an idea how many users there are.
Nucleus.init('600a02d29971711903443e4d', {
  disableTracking: true,
});

const Analytics = ({ analytics }: { analytics: boolean }) => {
  useEffect(() => {
    Nucleus.appStarted();
  }, []);

  useEffect(() => {
    if (analytics) Nucleus.enableTracking();
    else Nucleus.disableTracking();
  }, [analytics]);

  return <span style={{ display: 'none' }} />;
};

export default Analytics;
