import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

import { ClipLoader } from "react-spinners";

import { toast } from "react-toastify";

import "./photopage.css";

const PhotoPage = ({ userData }) => {
  const user = userData;
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [addImage, setAddImage] = useState(false);

  const [loading, setLoading] = useState(false);

  const [imageOrientations, setImageOrientations] = useState({});
  const [displayImage, setDisplayImage] = useState(false);
  const [imagePopup, setImagePopup] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadImage = async () => {
    if (!imageFiles.length) return;

    // increment photo counter first
    const { error: rpcError } = await supabase.rpc("increment_photos", {
      user_uuid: user.userId,
      numadded: imageFiles.length,
    });

    if (rpcError) {
      console.error("Error incrementing photosAdded:", rpcError);
      return;
    }

    toggleAddImage();
    const toastId = toast.loading(
      "Uploading: this may take a while if uploading multiple at once..."
    );

    try {
      // 🔹 Upload all files in parallel instead of sequentially
      const uploadPromises = imageFiles.map((file) =>
        supabase.storage.from("wedding-pictures").upload(
          `public/${user.userId}-${file.name}`, // safer unique path
          file,
          {
            cacheControl: "31536000",
            upsert: false,
          }
        )
      );

      const results = await Promise.all(uploadPromises);

      // check if any failed
      const failed = results.filter((res) => res.error);
      if (failed.length > 0) {
        console.error("Some uploads failed:", failed);
        toast.update(toastId, {
          render: "Some images failed to upload ❌",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: "Images uploaded! ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }

      // refresh gallery
      fetchImages();
    } catch (err) {
      console.error("Upload error:", err);
      toast.update(toastId, {
        render: "Upload failed ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const displayImagePopup = (url) => {
    setImagePopup(url);
    setDisplayImage(true);
  };

  const closePopup = () => {
    setDisplayImage(false);
  };

  const handleImageUpload = (e) => {
    setLoading(true);
    const files = Array.from(e.target.files);
    console.log(files.length);
    setImageFiles(files);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);
    setLoading(false);
  };

  const handleImageLoad = (e, url) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageOrientations((prev) => ({
      ...prev,
      [url]: naturalWidth > naturalHeight ? "landscape" : "portrait",
    }));
  };

  async function fetchImages() {
    setLoading(true);
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
      const optimizedUrl = `${publicUrlData.publicUrl}?width=600&quality=75&format=webp`;

      // return publicUrlData.publicUrl;
      return optimizedUrl;
    });

    setImages(urls);
    setLoading(false);
  }

  function toggleAddImage() {
    setImageFiles([]);
    setPreviews([]);
    setAddImage(!addImage);
  }

  const handleRemovePreview = (indexToRemove) => {
    const newFiles = imageFiles.filter((_, idx) => idx !== indexToRemove);
    const newPreviews = previews.filter((_, idx) => idx !== indexToRemove);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div>
      {loading ? (
        <div>
          <ClipLoader
            color={"#5a86ad"}
            loading={true}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          {addImage && (
            <>
              <div className="backdrop" onClick={toggleAddImage} />

              <div className="modal">
                <button className="modal-close" onClick={toggleAddImage}>
                  ×
                </button>

                {previews.length > 0 && (
                  <div className="preview-container">
                    {previews.map((src, i) => (
                      <div className="preview-item" key={src}>
                        <img src={src} alt={`preview-${i}`} />
                        <button onClick={() => handleRemovePreview(i)}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {previews.length > 0 && (
                  <button className="upload-btn" onClick={uploadImage}>
                    Upload
                  </button>
                )}

                <div className="file-input-wrapper">
                  <label className="file-label">
                    Choose Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {displayImage ? (
            <>
              <div className="backdrop" onClick={closePopup} />

              <div className="modal">
                <button className="modal-close" onClick={closePopup}>
                  ×
                </button>

                <div>
                  <img
                    key={imagePopup}
                    src={imagePopup}
                    style={{
                      width: "90vw",
                      borderRadius: "6px",
                      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                  <p className="save-hint">
                    📌 Tap & Hold the image to Save to Photos
                  </p>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="image-grid">
            {images.map((url) => (
              <img
                onClick={() => displayImagePopup(url)}
                key={url}
                src={url}
                onLoad={(e) => handleImageLoad(e, url)}
                className={`grid-image ${imageOrientations[url] || ""}`}
                loading="lazy"
              />
            ))}

            <button className="fab-btn" onClick={toggleAddImage}>
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoPage;
