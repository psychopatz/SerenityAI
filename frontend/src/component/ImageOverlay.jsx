import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageOverlay = ({ imageSrc, onClose }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <img src={imageSrc} alt="Full Screen" style={{ maxWidth: '90%', maxHeight: '90%' }} />
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

ImageOverlay.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageOverlay;
