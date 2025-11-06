import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "./BlogForm";
import "../App.css";

import { useNavigate } from "react-router-dom";

const Home = ({ user, setUser }) => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Fetch blogs failed", err);
    }
  };

  useEffect(() => {
    if (!user || !user.email) {
      // not logged in — send to auth page
      navigate("/");
    } else {
      fetchBlogs();
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleLogout = () => {
    setUser({ name: "", email: "" });
    localStorage.removeItem("mini_blog_user");
    navigate("/");
  };

  return (
    <div style={{ margin: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>📚 Mini Blog</h1>
        <div>
          <span style={{ marginRight: 12 }}>Welcome, {user?.name || user?.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <BlogForm userEmail={user.email} refreshBlogs={fetchBlogs} />

      <h2>All Blogs</h2>
      <ul>
        {blogs.map((b) => (
          <li key={b._id} style={{ marginBottom: 10 }}>
            <strong>{b.title}</strong> by {b.authorEmail} <br />
            {b.content} <br />
            {b.authorEmail === user.email && (
              <button onClick={() => handleDelete(b._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
