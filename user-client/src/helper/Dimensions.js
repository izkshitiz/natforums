import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return { width };
}

export default function Dimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return windowDimensions;
}