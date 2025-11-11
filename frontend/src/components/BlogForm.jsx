import { useState } from 'react';

export default function BlogForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [err, setErr] = useState('');

  function submit(e) {
    e.preventDefault();
    setErr('');
    if (!title.trim()) return setErr('Title required.');
    if (!content.trim()) return setErr('Content required.');
    onAdd({ id: Date.now(), title: title.trim(), content: content.trim(), created: new Date().toISOString() });
    setTitle('');
    setContent('');
  }

  return (
    <form className="blog-form" onSubmit={submit}>
      <h3>Add a new post</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Write your blog here..."></textarea>
      {err && <div className="msg">{err}</div>}
      <div className="controls">
        <button className="btn" type="submit">Add Blog</button>
      </div>
    </form>
  );
}
