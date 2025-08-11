import React, { useRef, useState } from 'react';
import { Button, Box, IconButton, CircularProgress } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import axios from 'axios';

const VideoSnap = ({ userId }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(blob => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage({ blob, url: imageUrl });
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const uploadSnapshot = async () => {
    if (!capturedImage?.blob) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('snapshot', capturedImage.blob, 'snapshot.jpg');
      
      const response = await axios.post('/api/snapshot/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Snapshot saved successfully!');
      setCapturedImage(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload snapshot');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Box sx={{ 
        border: '1px solid #ddd', 
        borderRadius: 2, 
        overflow: 'hidden',
        position: 'relative',
        height: 400
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            display: isRecording ? 'block' : 'none' 
          }}
        />
        
        {!isRecording && (
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: '#f5f5f5'
          }}>
            <VideocamIcon sx={{ fontSize: 60, color: '#999' }} />
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {!isRecording ? (
          <Button 
            variant="contained" 
            startIcon={<VideocamIcon />}
            onClick={startCamera}
            fullWidth
          >
            Start Camera
          </Button>
        ) : (
          <>
            <IconButton 
              color="primary" 
              onClick={captureSnapshot}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <CameraAltIcon />
            </IconButton>
            <Button 
              variant="outlined" 
              onClick={stopCamera}
              fullWidth
            >
              Stop Camera
            </Button>
          </>
        )}
      </Box>

      {capturedImage && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <h3>Captured Snapshot:</h3>
          <img 
            src={capturedImage.url} 
            alt="Captured" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: 300,
              border: '1px solid #ddd',
              borderRadius: 4
            }} 
          />
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={uploadSnapshot}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
          >
            {isUploading ? 'Uploading...' : 'Save Snapshot'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VideoSnap;