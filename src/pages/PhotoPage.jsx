import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";

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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
              minWidth: "330px",
            }}
          >
            <button
              onClick={toggleAddImage}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "red",
                color: "white",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ×
            </button>

            {preview && (
              <div
                style={{
                  position: "relative",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={preview}
                  style={{
                    height: "200px",
                    borderRadius: "8px",
                  }}
                />
                <button
                  onClick={() => setPreview(null)}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    border: "none",
                    background: "red",
                    color: "white",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {preview && (
              <button
                onClick={uploadImage}
                style={{ padding: "8px 16px", marginTop: "5px" }}
              >
                Upload
              </button>
            )}

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <label
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: "#4267B2",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Choose Image
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        </>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {images.map((url) => (
          <img
            key={url}
            src={url}
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        ))}

        {/* floating + button */}
        <button
          onClick={toggleAddImage}
          style={{
            borderRadius: "100%",
            fontWeight: "bold",
            fontSize: "150%",
            width: "60px",
            height: "60px",
            backgroundColor: "#4267B2",
            color: "white",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default PhotoPage;
