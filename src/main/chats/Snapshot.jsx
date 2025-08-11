// components/SnapshotUploader.js
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { useUploadSnapshotMutation } from '../../features/chat/snapshotApi';
import { Box, Button, Typography } from '@mui/material';

const videoConstraints = {
  width: 300,
  height: 200,
  facingMode: 'user',
};

const SnapshotUploader = ({onClick}) => {
  const webcamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
   const startCamera = () => setCameraActive(true);
  const [uploadSnapshot] = useUploadSnapshotMutation();

  const captureAndUpload = () => {
    const screenshot = webcamRef.current.getScreenshot();

    if (!screenshot) {
      toast.error('No image captured');
      return;
    }

    // Convert base64 to Blob
    const byteString = atob(screenshot.split(',')[1]);
    const mimeString = screenshot.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append('snapshot', blob, 'snapshot.jpg');

    uploadSnapshot(formData)
      .unwrap()
      .then((res) => {
        toast.success('Snapshot uploaded successfully');
        console.log(res);
      })
      .catch(() => {
        toast.error('Snapshot upload failed');
      });
  };

  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>Take a Snapshot</Typography>

      {!cameraActive ? (
        <Button variant="contained" onClick={startCamera}>Start Camera</Button>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            height={200}
            videoConstraints={videoConstraints}
          />

          <Box mt={2}>
            <Button variant="contained" onClick={captureAndUpload}>
              Capture & Upload
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SnapshotUploader;
