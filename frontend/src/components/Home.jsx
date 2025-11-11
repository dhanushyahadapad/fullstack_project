import React, { useEffect, useState } from "react";
import BlogForm from "./BlogForm";

export default function Home({ user }) {
  const safeUsername = user && user.username ? String(user.username).toLowerCase() : null;
  const storageKey = safeUsername ? `miniblog_blogs_${safeUsername}` : null;

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (!storageKey) {
      setBlogs([]);
      return;
    }

    const defaultBlog = {
      id: 1,
      title: "Welcome to MiniBlog 🎉",
      content:
        "This is your first blog post! You can edit, delete, or add new posts anytime. MiniBlog stores your posts locally on your browser — so everything you write stays private to you.",
      created: new Date().toISOString(),
      image: null,
      imageName: null,
    };

    try {
      const raw = localStorage.getItem(storageKey);
      const saved = JSON.parse(raw || "[]");
      if (!Array.isArray(saved) || saved.length === 0) {
        setBlogs([defaultBlog]);
        localStorage.setItem(storageKey, JSON.stringify([defaultBlog]));
      } else {
        setBlogs(saved);
      }
    } catch (err) {
      console.error("Home: error reading blogs for", storageKey, err);
      setBlogs([defaultBlog]);
      localStorage.setItem(storageKey, JSON.stringify([defaultBlog]));
    }
  }, [storageKey]);

  function save(list) {
    setBlogs(list);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(list));
  }

  function addBlog(blog) {
    // blog may include: title, content, image (dataURL), imageName
    const maxId = blogs.length ? Math.max(...blogs.map((b) => (typeof b.id === "number" ? b.id : 0))) : 1;
    const nextId = maxId + 1;
    const newBlog = {
      id: nextId,
      title: blog.title,
      content: blog.content,
      created: new Date().toISOString(),
      image: blog.image || null,
      imageName: blog.imageName || null,
    };
    save([newBlog, ...blogs]);
  }

  function deleteBlog(id) {
    if (!window.confirm("Delete this blog?")) return;
    save(blogs.filter((b) => b.id !== id));
  }

  // Render UI (same structure you already have)
  return (
    <div className="home-wrap">
      <div className="left">
        <h2>Blog</h2>
        <BlogForm onAdd={addBlog} />
      </div>

      <div className="right">
        <h3>Your posts</h3>
        {blogs.length === 0 && <p className="muted">No posts yet — write your first one!</p>}
        <ul className="posts">
          {blogs.map((b) => (
            <li className="post" key={b.id}>
              <div className="post-head">
                <strong>{b.title}</strong>
                <small>{new Date(b.created).toLocaleString()}</small>
              </div>

              {/* Show image if present */}
              {b.image && (
                <div className="post-image-wrap">
                  <img className="post-image" src={b.image} alt={b.imageName || b.title} />
                </div>
              )}

              <p className="post-body">{b.content}</p>

              <div className="post-actions">
                <button className="btn btn-sm btn-danger" onClick={() => deleteBlog(b.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
