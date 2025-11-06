import React, { useState } from "react";
import axios from "axios";
import "../App.css";


const BlogForm = ({ userEmail, refreshBlogs }) => {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/blogs", { ...formData, authorEmail: userEmail });
      alert("✅ Blog posted!");
      setFormData({ title: "", content: "" });
      refreshBlogs();
    } catch (err) {
      alert("❌ Failed to post blog");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Create Blog</h3>
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <textarea name="content" placeholder="Content" value={formData.content} onChange={handleChange} required />
      <button type="submit">Post Blog</button>
    </form>
  );
};

export default BlogForm;
