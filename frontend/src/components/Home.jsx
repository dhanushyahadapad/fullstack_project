import React, { useEffect, useState } from 'react';
import BlogForm from './BlogForm';

export default function Home({ user }) {
  // compute a safe storageKey (may be null if no user)
  const safeUsername = user && user.username ? String(user.username).toLowerCase() : null;
  const storageKey = safeUsername ? `miniblog_blogs_${safeUsername}` : null;

  // Hooks must be declared unconditionally at the top
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // If there's no storageKey (no logged-in user), do nothing here.
    if (!storageKey) {
      // ensure blogs is empty when no user
      setBlogs([]);
      return;
    }

    // create default blog inside the effect so it's not a dependency
    const defaultBlog = {
      id: 1,
      title: 'Welcome to MiniBlog 🎉',
      content:
        'This is your first blog post! You can edit, delete, or add new posts anytime. MiniBlog stores your posts locally on your browser — so everything you write stays private to you.',
      created: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(storageKey);
      const saved = JSON.parse(raw || '[]');
      if (!Array.isArray(saved) || saved.length === 0) {
        setBlogs([defaultBlog]);
        localStorage.setItem(storageKey, JSON.stringify([defaultBlog]));
        console.log('Home: wrote default blog for', safeUsername);
      } else {
        setBlogs(saved);
        console.log('Home: loaded blogs for', safeUsername, saved);
      }
    } catch (err) {
      console.error('Home: error reading blogs for', storageKey, err);
      setBlogs([defaultBlog]);
      localStorage.setItem(storageKey, JSON.stringify([defaultBlog]));
    }
    // only re-run when storageKey changes
  }, [storageKey]);

  // helper to persist list
  function save(list) {
    setBlogs(list);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(list));
      console.log('Home: saved', list.length, 'blogs to', storageKey);
    }
  }

  function addBlog(blog) {
    const maxId = blogs.length ? Math.max(...blogs.map(b => (typeof b.id === 'number' ? b.id : 0))) : 1;
    const nextId = maxId + 1;
    const newBlog = { ...blog, id: nextId, created: new Date().toISOString() };
    save([newBlog, ...blogs]);
  }

  function deleteBlog(id) {
    if (!window.confirm('Delete this blog?')) return;
    save(blogs.filter(b => b.id !== id));
  }

  // Render friendly message if no user — but hooks already ran above
  if (!user || !user.username) {
    return (
      <div className="home-wrap">
        <div className="left">
          <h2>Blog</h2>
          <p className="muted">Please log in to see your blogs.</p>
        </div>
        <div className="right">
          <h3>Your posts</h3>
          <p className="muted">No user detected.</p>
        </div>
      </div>
    );
  }

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
          {blogs.map(b => (
            <li className="post" key={b.id}>
              <div className="post-head">
                <strong>{b.title}</strong>
                <small>{new Date(b.created).toLocaleString()}</small>
              </div>
              <p className="post-body">{b.content}</p>
              <div className="post-actions">
                <button className="btn btn-sm btn-danger" onClick={() => deleteBlog(b.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
