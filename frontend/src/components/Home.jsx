import React, { useEffect, useState } from "react";
import BlogForm from "./BlogForm";

/*
  Home.jsx — colourful & decorative
  - safeUsername/storageKey so it won't crash if user missing
  - default welcome post for new users
  - decorative inline SVG doodles
*/

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
    const maxId = blogs.length ? Math.max(...blogs.map((b) => (typeof b.id === "number" ? b.id : 0))) : 1;
    const nextId = maxId + 1;
    const newBlog = { ...blog, id: nextId, created: new Date().toISOString() };
    save([newBlog, ...blogs]);
  }

  function deleteBlog(id) {
    if (!window.confirm("Delete this blog?")) return;
    save(blogs.filter((b) => b.id !== id));
  }

  return (
    <div className="creative-page">
      {/* Decorative background doodles */}
      <svg className="doodle doodle-1" viewBox="0 0 200 200" aria-hidden>
        <path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round"/>
      </svg>

      <svg className="doodle doodle-2" viewBox="0 0 200 200" aria-hidden>
        <circle cx="20" cy="20" r="12" fill="rgba(255,255,255,0.04)"/>
        <circle cx="60" cy="40" r="8" fill="rgba(255,255,255,0.03)"/>
        <circle cx="120" cy="80" r="18" fill="rgba(255,255,255,0.02)"/>
      </svg>

      <header className="creative-hero">
        <div className="hero-left">
          <h1 className="hero-main">MiniBlog</h1>
          <p className="hero-sub">Write, doodle, and share little pieces of your mind.</p>

          <div className="hero-actions">
            <span className="author-pill">Author: <strong>{safeUsername || "Guest"}</strong></span>
            <div className="small-doodles" aria-hidden>
              {/* tiny pen doodle */}
              <svg width="34" height="18" viewBox="0 0 34 18"><path d="M2 12c6-4 12-8 17-9 2.5-.5 6 1 9 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
              {/* mini paper */}
              <svg width="24" height="18" viewBox="0 0 24 18"><rect x="1" y="1" width="22" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {/* playful handwritten badge */}
          <div className="badge-handwritten">Create ✍️</div>
          {/* colorful stack */}
          <div className="stacks">
            <div className="stack s1" />
            <div className="stack s2" />
            <div className="stack s3" />
          </div>
        </div>
      </header>

      <main className="creative-main">
        <aside className="left-col">
          <div className="card write-card">
            <h2 className="card-title">New Post</h2>
            <BlogForm onAdd={addBlog} />
            <div className="note">Tip: Try using emoji in titles — it brightens the feed.</div>
          </div>
        </aside>

        <section className="right-col">
          <div className="card feed-card">
            <h2 className="card-title">Your Posts</h2>

            {blogs.length === 0 && <p className="muted">No posts yet — write your first one!</p>}

            <ul className="posts-list">
              {blogs.map((b) => (
                <li className="post-card" key={b.id}>
                  <div className="post-top">
                    <div className="post-badge">#{b.id}</div>
                    <div className="post-title">{b.title}</div>
                    <div className="post-time">{new Date(b.created).toLocaleString()}</div>
                  </div>

                  <div className="post-body">{b.content}</div>

                  <div className="post-footer">
                    <div className="post-actions">
                      <button className="btn btn-sm btn-like" title="Random doodle">🎨</button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteBlog(b.id)}
                        title="Delete post"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
