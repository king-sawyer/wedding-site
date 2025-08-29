import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import "./photopage.css";

const PAGE_SIZE = 20;

const PhotoPage = ({ userData }) => {
  const user = userData;
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [addImage, setAddImage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [imageOrientations, setImageOrientations] = useState({});
  const [displayImage, setDisplayImage] = useState(false);
  const [imagePopup, setImagePopup] = useState(null);

  // ---------------------------
  // Infinite scroll setup
  // ---------------------------
  useEffect(() => {
    fetchImages(0);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 0) {
      fetchImages(page);
    }
  }, [page]);

  async function fetchImages(pageNumber) {
    if (loading || !hasMore) return;
    setLoading(true);

    const { data, error } = await supabase.storage
      .from("wedding-pictures")
      .list("public", { limit: PAGE_SIZE, offset: pageNumber * PAGE_SIZE });

    if (error) {
      console.error("Error listing images:", error);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const urls = data.map((file) => {
      const { data: publicUrlData } = supabase.storage
        .from("wedding-pictures")
        .getPublicUrl(`public/${file.name}`);
      return `${publicUrlData.publicUrl}?width=600&quality=75&format=webp`;
    });

    setImages((prev) => [...prev, ...urls]);
    setLoading(false);
  }

  // ---------------------------
  // Upload logic
  // ---------------------------
  const uploadImage = async () => {
    if (!imageFiles.length) return;

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
      const uploadPromises = imageFiles.map((file) =>
        supabase.storage
          .from("wedding-pictures")
          .upload(`public/${user.userId}-${file.name}`, file, {
            cacheControl: "31536000",
            upsert: false,
          })
      );

      const results = await Promise.all(uploadPromises);
      const failed = results.filter((res) => res.error);

      if (failed.length > 0) {
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

      // Refresh first page
      setPage(0);
      setImages([]);
      setHasMore(true);
      fetchImages(0);
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

  // ---------------------------
  // Helpers
  // ---------------------------
  const displayImagePopup = (url) => {
    setImagePopup(url);
    setDisplayImage(true);
  };

  const closePopup = () => setDisplayImage(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleImageLoad = (e, url) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageOrientations((prev) => ({
      ...prev,
      [url]: naturalWidth > naturalHeight ? "landscape" : "portrait",
    }));
  };

  function toggleAddImage() {
    setImageFiles([]);
    setPreviews([]);
    setAddImage(!addImage);
  }

  const handleRemovePreview = (indexToRemove) => {
    setImageFiles((files) => files.filter((_, i) => i !== indexToRemove));
    setPreviews((previews) => previews.filter((_, i) => i !== indexToRemove));
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
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
                    <button onClick={() => handleRemovePreview(i)}>×</button>
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

      {displayImage && (
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
      )}

      <div className="image-grid">
        {images.map((url) => (
          <img
            key={url}
            src={url}
            onClick={() => displayImagePopup(url)}
            onLoad={(e) => handleImageLoad(e, url)}
            className={`grid-image ${imageOrientations[url] || ""}`}
            loading="lazy"
          />
        ))}

        {loading && <ClipLoader size={40} color="#5a86ad" />}
        {!hasMore && <p className="end-message">No more images 🎉</p>}

        <button className="fab-btn" onClick={toggleAddImage}>
          +
        </button>
      </div>
    </div>
  );
};

export default PhotoPage;
