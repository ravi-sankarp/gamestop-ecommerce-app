/* eslint-disable no-param-reassign */
/* eslint-disable no-unreachable */
import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import Cropper from 'react-easy-crop';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slider,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import getCroppedImg from './CropImageUtil';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';

function CropImage({ photoURL, index, fileName, type, handleToggleCrop, setImages, openCrop }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const errorHandler = useApiErrorHandler();

  const cropComplete = (croppedArea, _croppedAreaPixels) => {
    setCroppedAreaPixels(_croppedAreaPixels);
  };

  const zoomPercent = (value) => `${Math.round(value * 100)}%`;

  const cropImage = async () => {
    try {
      const { file: blob } = await getCroppedImg(photoURL, croppedAreaPixels, rotation);
      const file = new File([blob], fileName, { type });
      setImages((images) => ({ ...images, [index]: file }));
      handleToggleCrop();
    } catch (error) {
      console.log(error);
      errorHandler(error);
    }
  };
  return (
    <Dialog
      open={openCrop}
      onClose={handleToggleCrop}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 }
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>
              Zoom:
              {zoomPercent(zoom)}
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, _zoom) => setZoom(_zoom)}
            />
          </Box>
          <Box>
            <Typography>
              Rotation:
              {`${rotation}°`}
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={360}
              value={rotation}
              onChange={(e, _rotation) => setRotation(_rotation)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => handleToggleCrop()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CropIcon />}
            onClick={cropImage}
          >
            Crop
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default CropImage;
