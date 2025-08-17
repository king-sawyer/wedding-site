import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

import "./photopage.css";

const PhotoPage = () => {
  console.log(supabase);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [addImage, setAddImage] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function uploadImage() {
    if (!imageFile) return;

    const { data, error } = await supabase.storage
      .from("wedding-pictures")
      .upload(`public/${imageFile.name}`, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) console.error(error);
    else {
      console.log("Uploaded:", data);
      fetchImages();
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function fetchImages() {
    const { data, error } = await supabase.storage
      .from("wedding-pictures")
      .list("public", { limit: 100 });

    if (error) {
      console.error("Error listing images:", error);
      return;
    }

    const urls = data.map((file) => {
      const { data: publicUrlData } = supabase.storage
        .from("wedding-pictures")
        .getPublicUrl(`public/${file.name}`);
      return publicUrlData.publicUrl;
    });

    setImages(urls);
  }

  function toggleAddImage() {
    setImageFile(null);
    setPreview(null);
    setAddImage(!addImage);
  }

  return (
    <div>
      {addImage && (
        <>
          <div className="backdrop" />

          <div className="modal">
            <button className="modal-close" onClick={toggleAddImage}>
              ×
            </button>

            {preview && (
              <div className="preview-wrapper">
                <img className="preview-image" src={preview} />
                <button
                  className="preview-remove"
                  onClick={() => setPreview(null)}
                >
                  ×
                </button>
              </div>
            )}

            {preview && (
              <button className="upload-btn" onClick={uploadImage}>
                Upload
              </button>
            )}

            <div className="file-input-wrapper">
              <label className="file-label">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </label>
            </div>
          </div>
        </>
      )}

      <div className="image-grid">
        {images.map((url) => (
          <img key={url} src={url} className="grid-image" />
        ))}

        <button className="fab-btn" onClick={toggleAddImage}>
          +
        </button>
      </div>
    </div>
  );
};

export default PhotoPage;
