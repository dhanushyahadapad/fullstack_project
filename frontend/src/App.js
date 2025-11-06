import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState({ name: "", email: "" });

  // Load user from localStorage on app start
  useEffect(() => {
    const saved = localStorage.getItem("mini_blog_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user && user.email) localStorage.setItem("mini_blog_user", JSON.stringify(user));
    else localStorage.removeItem("mini_blog_user");
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage setUser={setUser} />} />
        <Route path="/home" element={<Home user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
