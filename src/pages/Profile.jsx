import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const Profile = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback(async () => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);
    canvas.width = size;
    canvas.height = size;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      size,
      size,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, "image/png");
    });
  }, [imageSrc, croppedAreaPixels]);

  const showCroppedImage = useCallback(async () => {
    const croppedImageUrl = await getCroppedImg();
    setCroppedImage(croppedImageUrl);
  }, [getCroppedImg]);

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageSrc && !croppedImage && (
        <div className="relative w-64 h-64 bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={showCroppedImage}
            className="absolute bottom-2 left-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Crop Image
          </button>
        </div>
      )}

      {croppedImage && (
        <div className="w-48 h-48 rounded-full overflow-hidden border border-gray-300">
          <img
            src={croppedImage}
            alt="Cropped"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
