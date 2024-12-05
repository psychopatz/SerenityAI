import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { styled, width } from '@mui/system';
import { motion } from 'framer-motion';

const specialists = [
  {
    id: 1,
    name: 'John Michael I. Pogoy',
    degree: 'Appdev/Electives',
    image: 'CEO.jpg',
    bannerImage: 'Pogoy.gif',
    age: 21,
    position: 'Full Stack Developer',
    quote: 'Every 60 seconds, a minute passes.',
  },
  {
    id: 2,
    name: 'Shane Adrian C. Opinion',
    degree:  'Appdev/Electives',
    image: 'Shane.jpg',
    bannerImage: 'oldman.gif',
    age: 23,
    position: 'Full Stack Developer',
    quote: 'It is what it is.',
  },
  {
    id: 3,
    name: 'Walter L. Canenda',
    degree:  'Appdev/Electives',
    image: 'ErenWalter.png',
    bannerImage: 'erenwalter.gif',
    age: 24,
    position: 'Full Stack Developer',
    quote: 'If I lose it all slip and fall, I will never look away.',
  },
  {
    id: 4,
    name: 'Patrick Romulo P. Cabiling',
    degree:  'Appdev/Electives',
    image: 'Jrizz.jpg',
    bannerImage: 'Jrizz.gif',
    age: 38,
    position: 'Full Stack Developer',
    quote: 'We treat the mind and body together.',
  },
  {
    id: 5,
    name: 'Patrick Oliver S. Bustamante',
    degree: 'Electives',
    image: 'PatrickStatic.webp',
    bannerImage: 'patrick.gif',
    get age() {
      return Math.floor(Math.random() * (100 - 10 + 1)) + 10; // Dynamically compute age on access
    },
    position: 'Full Stack Developer',
    quote: 'Go ahead and multiply!!',
    // quote: JSON.parse(localStorage.getItem("userdata")).firstName ? "Batig nawong si " + JSON.parse(localStorage.getItem("userdata")).firstName + "!! Hahahaha" : "",
  },
  {
    id: 6,
    name: 'Lloyd Scott A. Cabido',
    degree:  'Electives',
    image: 'Cabido.jpg',
    bannerImage: 'Cabido.jpg',
    age: 42,
    position: 'Frontend Developer',
    quote: 'Understanding the brain is key to understanding health.',
  },
];


// Styled components using Material-UI's styled API
const PageContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  overflowY: 'auto',
  backdropFilter: 'blur(5px)',
  paddingTop: theme.spacing(15),

}));

const HeroSection = styled(Box)(({ theme }) => ({
  maxWidth: 887,
  margin: 'auto',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: theme.breakpoints.down('md') ? 'column' : 'row',
  alignItems: 'stretch',
   background: 'linear-gradient(45deg, #4e54c8,#b5008e)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const BannerImageWrapper = styled(motion.div)({
  flex: 3,
  position: 'absolute',
  height: 321.6,
  marginLeft: "541px",
  marginTop: "-32px",
  
});

const BannerContent = styled(CardContent)(({ theme }) => ({
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4, 4, 3),
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const TeamSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const TeamCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  cursor: 'pointer',
  padding: theme.spacing(3),
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],

  },
  background: 'linear-gradient(45deg, #4e54c8,#b5008e)'
}));

const SpecialistAvatar = styled(Avatar)(({ theme }) => ({
  width: 130,
  height: 130,
  marginBottom: theme.spacing(2),
  margin: 'auto',
  border: `3px solid ${theme.palette.primary.main}`,
}));

const AboutUsPage = () => {
  const [currentSpecialist, setCurrentSpecialist] = useState(0);

  const nextSpecialist = () => {
    setCurrentSpecialist((prev) => (prev + 1) % specialists.length);
  };

  const prevSpecialist = () => {
    setCurrentSpecialist((prev) => (prev - 1 + specialists.length) % specialists.length);
  };

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <BannerImageWrapper
          key={currentSpecialist}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <CardMedia
            component="img"
            image={specialists[currentSpecialist].bannerImage}
            alt={specialists[currentSpecialist].name}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        </BannerImageWrapper>

        <BannerContent>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
            {specialists[currentSpecialist].name}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, color: '#d7d7d7' }}>
            {specialists[currentSpecialist].degree}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#d7d7d7' }}>
            <strong>Age:</strong> {specialists[currentSpecialist].age}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: '#d7d7d7' }}>
            <strong>Position:</strong> {specialists[currentSpecialist].position}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 2, color: '#d7d7d7' }}>
            "{specialists[currentSpecialist].quote}"
          </Typography>
        </BannerContent>
      </HeroSection>

      {/* Controls */}
      <ControlsContainer>
        <Button variant="contained" color="primary" onClick={prevSpecialist}>
          <ChevronLeft />
        </Button>
        <Button variant="contained" color="primary" onClick={nextSpecialist}>
          <ChevronRight />
        </Button>
      </ControlsContainer>

      {/* Team Section */}
      <TeamSection>
        <Typography variant="h3" sx={{ mb: 4, color: '#de02ae', fontWeight: 'bold', filter: 'drop-shadow(-14px 6px 35px #6d0075)' }}>
          Serenity AI Team
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {specialists.map((specialist) => (
            <Grid item xs={12} sm={6} md={4} key={specialist.id}>
              <TeamCard onClick={() => setCurrentSpecialist(specialists.indexOf(specialist))}>
                <SpecialistAvatar src={specialist.image} alt={specialist.name} sx={{ bgcolor: 'white' }} />
                <Typography variant="h6" sx={{ color: '#d7d7d7', mb: 1 }}>
                  {specialist.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#d7d7d7' }}>
                  {specialist.degree}
                </Typography>
              </TeamCard>
            </Grid>
          ))}
        </Grid>
      </TeamSection>
    </PageContainer>
  );
};

export default AboutUsPage;
