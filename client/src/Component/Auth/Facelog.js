// src/components/FacialLogin.js
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

import './login.css';

const Facelog = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [areModelsLoaded, setAreModelsLoaded] = useState(false);
  const [isFaceMatched, setIsFaceMatched] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      setAreModelsLoaded(true);
    };

    loadModels();
  }, []);

  const startCamera = () => {
    setIsCameraActive(true);
    setIsFaceMatched(false);
    setError(null);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const captureAndDetect = async () => {
    if (webcamRef.current && areModelsLoaded) {
      const image = webcamRef.current.getScreenshot();
      const img = await faceapi.fetchImage(image);
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detection) {
        // Draw landmarks on canvas
        const displaySize = { width: img.width, height: img.height };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, detection.landmarks);

        console.log('Detected Descriptor Length:', detection.descriptor.length);

        const registeredFaceDescriptor = JSON.parse(localStorage.getItem('registeredFaceDescriptor'));

        if (registeredFaceDescriptor) {
          console.log('Registered Descriptor Length:', registeredFaceDescriptor.descriptors[0].length);

          if (detection.descriptor.length === registeredFaceDescriptor.descriptors[0].length) {
            const labeledDescriptors = new faceapi.LabeledFaceDescriptors(registeredFaceDescriptor.label,
              registeredFaceDescriptor.descriptors.map(descriptor => new Float32Array(descriptor)));
            const faceMatcher = new faceapi.FaceMatcher([labeledDescriptors]);
            const match = faceMatcher.findBestMatch(detection.descriptor);

            console.log('Match Label:', match.label);
            console.log('Match Distance:', match.distance);

            if (match.label === registeredFaceDescriptor.label && match.distance < 0.6) {
              // Face matched successfully
              setIsFaceMatched(true);
            } else {
              // Face not recognized
              setIsFaceMatched(false);
              setError('Error: Face not recognized. Please try again.');
            }
          } else {
            // Descriptor lengths do not match
            setIsFaceMatched(false);
            setError('Error: Descriptor lengths do not match.');
          }
        } else {
          // No registered face descriptor found
          setIsFaceMatched(false);
          setError('Error: No registered face descriptor found.');
        }
      } else {
        // No face detected
        setIsFaceMatched(false);
        setError('Error: No face detected. Please try again.');
      }
    }
  };


  return (
    <div className="facial-login">
      <div className="camera-container">
        {isCameraActive && (
          <>
            <Webcam
              ref={webcamRef}
              width={400}
              height={300}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
              mirrored={true}
            />
            <canvas ref={canvasRef} className="face-canvas" />
          </>
        )}
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
      {error && <div className="error-container">{error}</div>}
      {isFaceMatched && <div className="result-container">Login successful!</div>}
    </div>
  );
};

export default Facelog;
