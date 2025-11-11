import React, { useState } from "react";

/*
 BlogForm with optional image upload.
 - onAdd({ title, content, image }) where image is a base64 data URL or null.
*/

export default function BlogForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");
  const [imageData, setImageData] = useState(null); // data URL
  const [imageName, setImageName] = useState("");

  // convert picked file to dataURL and set preview
  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageData(null);
      setImageName("");
      return;
    }

    // Optional: limit file size (example: 2.5MB)
    const maxBytes = 2.5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErr("Image too large (max 2.5 MB). Choose a smaller file.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result); // base64 data URL
      setImageName(file.name);
      setErr("");
    };
    reader.onerror = () => {
      setErr("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageData(null);
    setImageName("");
  }

  function submit(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) return setErr("Title required.");
    if (!content.trim()) return setErr("Content required.");

    const payload = {
      title: title.trim(),
      content: content.trim(),
      image: imageData || null,
      imageName: imageName || null,
    };

    if (typeof onAdd === "function") onAdd(payload);

    // reset
    setTitle("");
    setContent("");
    setImageData(null);
    setImageName("");
    setErr("");
    // clear file input value — find by id
    const fi = document.getElementById("blog-image-input");
    if (fi) fi.value = "";
  }

  return (
    <form className="blog-form" onSubmit={submit}>
      <h3>Add a new post</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Post title"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        placeholder="Write your blog here..."
        aria-label="Post content"
      />

      <label className="image-uploader">
        <input
          id="blog-image-input"
          type="file"
          accept="image/*"
          onChange={handleFile}
          aria-label="Add image"
        />
      </label>

      {imageData && (
        <div className="image-preview">
          <img src={imageData} alt={imageName || "preview"} />
          <div className="image-preview-controls">
            <span className="image-name">{imageName}</span>
            <button type="button" className="btn btn-ghost" onClick={removeImage}>
              Remove Image
            </button>
          </div>
        </div>
      )}

      {err && <div className="msg">{err}</div>}

      <div className="controls">
        <button className="btn" type="submit">
          Add Blog
        </button>
      </div>
    </form>
  );
}
