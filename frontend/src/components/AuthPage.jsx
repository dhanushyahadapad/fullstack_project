import { useState } from 'react';

/*
  AuthPage handles both Register and Login (toggle).
  onAuth({ username }) will be called on successful login.
  Users are stored in localStorage under 'miniblog_users' as [{username,password}, ...]
*/

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  function getUsers() {
    return JSON.parse(localStorage.getItem('miniblog_users') || '[]');
  }

  function saveUsers(list) {
    localStorage.setItem('miniblog_users', JSON.stringify(list));
  }

  function submit(e) {
    e.preventDefault();
    setNotice('');

    const uname = username.trim();
    if (!uname || !password) {
      setNotice('Please provide both username and password.');
      return;
    }

    const users = getUsers();

    if (mode === 'register') {
      const exists = users.some(u => u.username.toLowerCase() === uname.toLowerCase());
      if (exists) {
        setNotice('Username already exists. Pick another one.');
        return;
      }
      users.push({ username: uname, password });
      saveUsers(users);
      setNotice('Registration successful — you can now login.');
      setMode('login');
      setUsername('');
      setPassword('');
      return;
    }

    // login flow
    const found = users.find(u => u.username.toLowerCase() === uname.toLowerCase() && u.password === password);
    if (!found) {
      setNotice('Invalid username or password.');
      return;
    }

    onAuth({ username: found.username });
  }

  return (
    <div className="auth-card">
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>

      <form className="auth-form" onSubmit={submit}>
        <label>
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. johndoe"
            autoComplete="username"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
        </label>

        {notice && <div className="msg">{notice}</div>}

        <div className="controls">
          <button className="btn" type="submit">
            {mode === 'register' ? 'Create account' : 'Login'}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => { setMode(prev => prev === 'login' ? 'register' : 'login'); setNotice(''); }}
          >
            {mode === 'login' ? 'New here? Register' : 'Have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
