import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import { styled, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Baymax from '../assets/Baymax.json';
import StorageService from '../services/StorageService';

const storage = StorageService();

// Create a floating animation keyframe
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-20px) translateX(-50%);
  }
`;

const Container = styled(Box)(({ theme }) => ({
  zIndex: -1,
  width: '50%',
  position: 'absolute',
  bottom: '90px',
  left: '50%',
  transform: 'translateX(-50%)',
  marginBottom: '-100px',
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  [theme.breakpoints.down('sm')]: {
    width: '80%',
  },
}));

const AnimationWrapper = styled(Box)(({ filterStyle }) => ({
  filter: filterStyle,
  transition: 'filter 1s ease', // Smooth transition over 1 second
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
  // Get current location
  const location = useLocation();

  // Routes where Baymax should not render
  const excludedRoutes = ["/", "/login", "/register", "/404", "/profile", "/diary","/settings"];



  // Check if current route is excluded
  const shouldRender = !excludedRoutes.includes(location.pathname);

  // State to store current moodType
  const [moodType, setMoodType] = useState(
    storage.getSessionStorage('moodType') || 'happy' // Default to 'happy' if not set
  );
  
  // Ref to store the previous moodType for comparison
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
  
  // Only render if not on excluded routes
  if (!shouldRender) {
    return null;
  }

  return (
    <Container>
      <AnimationWrapper filterStyle={filterStyle}>
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