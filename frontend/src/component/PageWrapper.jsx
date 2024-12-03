import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageWrapper = ({ children }) => {
  const location = useLocation();

  // Define animation variants for a morphing effect
  const variants = {
    initial: { scale: 0.8, borderRadius: "50%" },
    animate: { scale: 1, borderRadius: "0%" },
    exit: { scale: 0.8, borderRadius: "50%" },
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
      style={{
        position: "relative",
        overflow: "hidden",
      }}
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
