// src/components/AnimatedBackground.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

/**
 * Custom throttle function to limit the frequency of function executions.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {Function} - The throttled function.
 */
function throttle(func, limit) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastFunc) {
          lastFunc.func.apply(lastFunc.context, lastFunc.args);
          lastRan = Date.now();
          lastFunc = null;
        }
      }, limit);
    } else {
      lastFunc = { func, context, args };
    }
  };
}

const AnimatedBackground = () => {
  const svgRef = useRef(null);
  const [circles, setCircles] = useState([]);
  const mousePosition = useRef({ x: null, y: null });

  // Configuration Constants
  const NUM_CIRCLES = 20; // Number of circles
  const MIN_RADIUS = 20;
  const MAX_RADIUS = 50;
  const MIN_VELOCITY = -1.0;
  const MAX_VELOCITY = 1.0;
  const REPULSION_DISTANCE = 120;
  const REPULSION_FORCE = 0.7;
  const FRICTION = 0.99; // Reduced friction for sustained movement
  const VELOCITY_THRESHOLD = 0.1; // Minimum velocity before boosting

  // Initialize circles on component mount
  useEffect(() => {
    const initialCircles = [];
    const gradients = [
      { id: 'grad1', colors: ['#ab3c51', '#4f4484'] },
      { id: 'grad2', colors: ['#e298de', '#484687'] },
      { id: 'grad3', colors: ['#84b6e0', '#464a8f'] },
    ];

    // Create SVG gradients
    const svg = svgRef.current;
    if (svg) {
      const defs = svg.querySelector('defs');
      gradients.forEach((gradient) => {
        const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        linearGradient.setAttribute('id', gradient.id);
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '100%');
        linearGradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', gradient.colors[0]);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', gradient.colors[1]);

        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
        defs.appendChild(linearGradient);
      });
    }

    // Initialize circles with random properties
    for (let i = 0; i < NUM_CIRCLES; i++) {
      const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
      initialCircles.push({
        id: `circle${i}`,
        cx: Math.random() * window.innerWidth,
        cy: Math.random() * window.innerHeight,
        r: radius,
        fill: `url(#grad${(i % 3) + 1})`, // Cycle through grad1, grad2, grad3
        vx: Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY,
        vy: Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY,
      });
    }

    setCircles(initialCircles);
  }, [NUM_CIRCLES, MAX_RADIUS, MIN_RADIUS, MAX_VELOCITY, MIN_VELOCITY]);

  // Handle mouse movement with custom throttling for performance
  useEffect(() => {
    const handleMouseMove = throttle((event) => {
      const rect = svgRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }, 100); // Throttle to every 100ms

    const handleMouseLeave = () => {
      mousePosition.current = { x: null, y: null };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          let { cx, cy, vx, vy, r } = circle;

          // Apply velocity
          cx += vx;
          cy += vy;

          // Boundary collision
          if (cx - r < 0) {
            cx = r;
            vx = -vx;
          }
          if (cx + r > window.innerWidth) {
            cx = window.innerWidth - r;
            vx = -vx;
          }
          if (cy - r < 0) {
            cy = r;
            vy = -vy;
          }
          if (cy + r > window.innerHeight) {
            cy = window.innerHeight - r;
            vy = -vy;
          }

          // Repulsion effect
          const { x: mouseX, y: mouseY } = mousePosition.current;
          if (mouseX !== null && mouseY !== null) {
            const dx = cx - mouseX;
            const dy = cy - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < REPULSION_DISTANCE) {
              const angle = Math.atan2(dy, dx);
              const force = (REPULSION_DISTANCE - distance) / REPULSION_DISTANCE;
              vx += Math.cos(angle) * REPULSION_FORCE * force;
              vy += Math.sin(angle) * REPULSION_FORCE * force;
            }
          }

          // Apply friction to slow down over time
          vx *= FRICTION;
          vy *= FRICTION;

          // Prevent circles from stopping by boosting velocity if below threshold
          if (Math.abs(vx) < VELOCITY_THRESHOLD && Math.abs(vy) < VELOCITY_THRESHOLD) {
            // Randomly decide whether to boost velocity
            if (Math.random() < 0.5) { // 50% chance to boost
              const boostAngle = Math.random() * 2 * Math.PI;
              const boostSpeed = Math.random() * 0.5 + 0.5; // Boost speed between 0.5 and 1.0
              vx += Math.cos(boostAngle) * boostSpeed;
              vy += Math.sin(boostAngle) * boostSpeed;

              // Optionally, cap the velocity to prevent excessive speeds
              const speed = Math.sqrt(vx * vx + vy * vy);
              const maxSpeed = 2.0;
              if (speed > maxSpeed) {
                vx = (vx / speed) * maxSpeed;
                vy = (vy / speed) * maxSpeed;
              }
            }
          }

          return { ...circle, cx, cy, vx, vy };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(animate);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [REPULSION_DISTANCE, REPULSION_FORCE, FRICTION, VELOCITY_THRESHOLD]);

  // Handle window resize to update SVG dimensions and circle positions
  useEffect(() => {
    const handleResize = throttle(() => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => ({
          ...circle,
          cx: Math.min(circle.cx, window.innerWidth - circle.r),
          cy: Math.min(circle.cy, window.innerHeight - circle.r),
        }))
      );
    }, 100); // Throttle to every 100ms

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      component="svg"
      ref={svgRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Ensure the background is behind other content
        overflow: 'hidden',
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
    >
      {/* Background Rect */}
      <rect width="100%" height="100%" fill="#32325d" />

      {/* Define Gradients */}
      <defs>
        {/* Gradients are dynamically added in useEffect */}
      </defs>

      {/* Render Circles */}
      {circles.map((circle) => (
        <circle
          key={circle.id}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill={circle.fill}
          opacity="0.8" // Added opacity for visual enhancement
        />
      ))}
    </Box>
  );
};

export default AnimatedBackground;
