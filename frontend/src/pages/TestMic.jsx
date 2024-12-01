import React from 'react';
import MicrophoneButton from '../component/MicrophoneButton';

const TestMic = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Test Microphone Feature</h2>
      <p>Click the button below to start recording and test the speech transcription feature.</p>
      <MicrophoneButton />
    </div>
  );
};

export default TestMic;
