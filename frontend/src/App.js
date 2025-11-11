import { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './components/AuthPage';
import Home from './components/Home';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('miniblog_currentUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function handleLogin(userObj) {
    setUser(userObj);
    localStorage.setItem('miniblog_currentUser', JSON.stringify(userObj));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('miniblog_currentUser');
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="brand">MiniBlog</h1>
        <div className="header-right">
          {user ? (
            <>
              <span className="welcome">Welcome, <strong>{user.username}</strong></span>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : null}
        </div>
      </header>

      <main className="app-main">
        {!user ? (
          <AuthPage onAuth={handleLogin} />
        ) : (
          <Home user={user} />
        )}
      </main>

      <footer className="app-footer">&copy; {new Date().getFullYear()} MiniBlog</footer>
    </div>
  );
}
