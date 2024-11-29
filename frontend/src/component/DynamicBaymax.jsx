import React, { useState, useEffect, useRef, useMemo } from 'react';
import Lottie from 'lottie-react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Baymax from '../assets/Baymax.json'; 
import StorageService from '../services/StorageService'; 
import { useLocation } from 'react-router-dom';

const storage = StorageService();

const Container = styled(Box)(({ theme }) => ({
  zIndex: -1,
  width: '50%',
  position: 'absolute',
  bottom: '90px',
  left: '50%',
  transform: 'translateX(-50%)',
  marginBottom: '-100px',
  [theme.breakpoints.down('sm')]: {
    width: '80%',
  },
}));

const floatAnimation = `
  @keyframes float {
    0% { transform: translatey(0px); }
    50% { transform: translatey(-10px); }
    100% { transform: translatey(0px); }
  }
`;

const AnimationWrapper = styled(Box)(({ filterStyle }) => ({
  animation: 'float 3s ease-in-out infinite',
  filter: filterStyle,
}));

const moodFilterMap = {
  happy: { hueRotate: 300, sepia: 1, saturate: 1150 },
  sad: { hueRotate: 807, sepia: 4, saturate: 1000 },
  angry: {hueRotate: 207, sepia: 2, saturate: 1000 },
  worried: { hueRotate: 970, sepia: 0.1, saturate: 100 },
  excited: {hueRotate: 7, sepia: 42, saturate: 5000 },
  calm: { hueRotate: 240, sepia: 0.3, saturate: 180 },
};

const DynamicBaymax = () => {

  const location = useLocation();

  // Define paths where DynamicBaymax should not be rendered
  const excludedPaths = ['/', '/login', '/register', '/404'];

  // Check if the current path is excluded
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  const [moodType, setMoodType] = useState(
    storage.getSessionStorage('moodType') || 'happy' 
  );

  const prevMoodTypeRef = useRef(moodType);

  // Function to retrieve moodType from sessionStorage
  const getMoodTypeFromSession = () => {
    const mood = storage.getSessionStorage('moodType');
    return mood ? mood : 'happy';
  };

  // Effect to poll for moodType changes in sessionStorage
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      const currentMood = getMoodTypeFromSession();
      if (currentMood !== prevMoodTypeRef.current) {
        if (moodFilterMap[currentMood]) {
          setMoodType(currentMood);
          prevMoodTypeRef.current = currentMood;
        } else {
          setMoodType('happy');
          prevMoodTypeRef.current = 'happy';
        }
      }
    }, 500); // Check every 500ms

    // Cleanup on unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  // Construct the filter string based on moodType
  const filterStyle = `
    drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))
    sepia(${moodFilterMap[moodType].sepia}%)
    hue-rotate(${moodFilterMap[moodType].hueRotate}deg)
    saturate(${moodFilterMap[moodType].saturate}%)
  `;

  const memoizedAnimationData = useMemo(() => Baymax, []);

  return (
    <Container>
      <AnimationWrapper filterStyle={filterStyle}>
        <style>{floatAnimation}</style>
        <Lottie
          animationData={memoizedAnimationData}
          loop={true}
          speed={0.2}
        />
      </AnimationWrapper>
    </Container>
  );
};

export default DynamicBaymax;
