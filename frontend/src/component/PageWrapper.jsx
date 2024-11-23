// PageWrapper.js
import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageWrapper = ({ children }) => {
  const location = useLocation();

  // Generate a random number to decide which animation to use
  const randomEffect = React.useMemo(() => Math.random(), [location.pathname]);

  // Define animation variants based on the random number
  const variants =
    randomEffect < 0.5
      ? {
          initial: { opacity: 0, scale: 0.8, rotate: 10 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          exit: { opacity: 0, scale: 0.8, rotate: -10 },
        }
      : {
          initial: { opacity: 0, x: -200 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 200 },
        };

  // Adjust the transition for smoother animation
  const transition = {
    type: "spring",
    stiffness: 80,
    damping: 20,
  };

  return (
    <motion.div
      key={location.pathname} // Ensure re-render on route change
      style={{ position: "relative", overflow: "hidden" }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at center, transparent 60%, black 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default PageWrapper;
