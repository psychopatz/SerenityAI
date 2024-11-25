import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';

const specialists = [
  {
    id: 1,
    name: 'John Michael I. Pogoy',
    degree: 'Appdev',
    image: 'cat1.jpg',
    bannerImage: 'cat1.jpg',
    age: 35,
    position: 'Senior Cardiologist',
    quote: 'Saving lives, one heartbeat at a time!',
  },
  {
    id: 2,
    name: 'Shane Adrian C. Opinion',
    degree: 'Appdev',
    image: 'cat2.jpg',
    bannerImage: 'cat2.jpg',
    age: 40,
    position: 'Pediatric Specialist',
    quote: 'Caring for children, one smile at a time.',
  },
  {
    id: 3,
    name: 'Walter L. Canenda',
    degree: 'Appdev',
    image: 'cat3.jpg',
    bannerImage: 'cat3.jpg',
    age: 45,
    position: 'Lead Neurologist',
    quote: 'The brain is the most fascinating organ to work with.',
  },
  {
    id: 4,
    name: 'Patrick Romulo P. Cabiling',
    degree: 'Appdev',
    image: 'cat4.jpg',
    bannerImage: 'cat4.jpg',
    age: 38,
    position: 'Neurologist',
    quote: 'We treat the mind and body together.',
  },
  {
    id: 5,
    name: 'Patrick Oliver S. Bustamante',
    degree: 'React',
    image: 'cat5.jpg',
    bannerImage: 'cat5.jpg',
    age: 50,
    position: 'Senior Neurologist',
    quote: 'Every diagnosis is a journey of its own.',
  },
  {
    id: 6,
    name: 'Lloyd Scott A. Cabido',
    degree: 'React',
    image: 'cat6.jpg',
    bannerImage: 'cat6.jpg',
    age: 42,
    position: 'Neurologist',
    quote: 'Understanding the brain is key to understanding health.',
  },
];

const AboutUsPage = () => {
  const [currentSpecialist, setCurrentSpecialist] = useState(0);

  const nextSpecialist = () => {
    setCurrentSpecialist((prev) => (prev + 1) % specialists.length);
  };

  const prevSpecialist = () => {
    setCurrentSpecialist((prev) => (prev - 1 + specialists.length) % specialists.length);
  };

  return (
    <Box sx={{ background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          p: 4,
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        {/* Banner */}
        <motion.div
          key={currentSpecialist}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{ flex: 3, position: 'relative', height: 450 }}
        >
          <CardMedia
            component="img"
            image={specialists[currentSpecialist].bannerImage}
            alt={specialists[currentSpecialist].name}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        </motion.div>

        {/* Banner Content */}
        <CardContent
          sx={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 4,
            py: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            {specialists[currentSpecialist].name}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
            {specialists[currentSpecialist].degree}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Age:</strong> {specialists[currentSpecialist].age}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Position:</strong> {specialists[currentSpecialist].position}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 2, color: 'text.secondary' }}>
            "{specialists[currentSpecialist].quote}"
          </Typography>
        </CardContent>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button variant="contained" color="primary" onClick={prevSpecialist}>
          <ChevronLeft />
        </Button>
        <Button variant="contained" color="primary" onClick={nextSpecialist}>
          <ChevronRight />
        </Button>
      </Box>

      {/* Team Section */}
      <Box sx={{ textAlign: 'center', py: 4, px: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h3" sx={{ mb: 4, color: 'secondary.main', fontWeight: 'bold' }}>
          Our Specialists
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {specialists.map((specialist) => (
            <Grid item xs={12} sm={6} md={4} key={specialist.id}>
              <Card
                onClick={() => setCurrentSpecialist(specialists.indexOf(specialist))}
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  p: 3,
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 },
                  transition: 'transform 0.3s',
                }}
              >
                <Avatar
                  src={specialist.image}
                  alt={specialist.name}
                  sx={{ width: 130, height: 130, mb: 2, mx: 'auto', border: '3px solid', borderColor: 'primary.main' }}
                />
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>
                  {specialist.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {specialist.degree}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AboutUsPage;
