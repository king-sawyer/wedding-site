import { useState } from "react";

const PhotoPage = () => {
  const [imageSrc, setImageSrc] = useState(null);

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

  return (
    <div>
      {imageSrc ? <img src={imageSrc} style={{ height: "200px" }} /> : <></>}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default PhotoPage;
