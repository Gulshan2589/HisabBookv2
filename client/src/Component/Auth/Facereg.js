import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

import './register.css';

const Facereg = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectionData, setDetectionData] = useState(null);
  const [username, setUsername] = useState('');
  const [areModelsLoaded, setAreModelsLoaded] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ]);

        setAreModelsLoaded(true);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  const startCamera = () => {
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const captureAndDetect = async () => {
    if (webcamRef.current && areModelsLoaded) {
      const image = webcamRef.current.getScreenshot();
      const img = await faceapi.fetchImage(image);

      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setDetectionData(detection.descriptor);
        // Draw landmarks on canvas
        const displaySize = { width: img.width, height: img.height };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, detection.landmarks);
      }
    }
  };

  const registerUser = () => {
    if (detectionData && username) {
      const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(username, [new Float32Array(detectionData)]);
      localStorage.setItem('registeredFaceDescriptor', JSON.stringify(labeledFaceDescriptor));
      alert('Registration successful!');
    } else {
      alert('No face detected or username provided for registration.');
    }
  };

  return (
    <div className="facial-registration">
      <div className="camera-container">
        {isCameraActive && (
          <>
            <Webcam
              ref={webcamRef}
              width={400}
              height={300}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              mirrored={true} />
            <canvas ref={canvasRef} className="face-canvas" />
          </>
        )}
      </div>
      <div className="username-input">
        <input className='inputbtn'
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="button-group">
        {!isCameraActive && <button onClick={startCamera}>Open Camera</button>}
        {isCameraActive && (
          <div>
            <button onClick={stopCamera}>Close Camera</button>
            <button onClick={captureAndDetect}>Capture and Detect</button>
          </div>
        )}
      </div>
      {detectionData && (
        <div className="result-container">
          <button onClick={registerUser}>Register</button>
        </div>
      )}
    </div>
  );
};

export default Facereg;
