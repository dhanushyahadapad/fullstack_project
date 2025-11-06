import React, { useState } from "react";
import axios from "axios";
import "../App.css";

import { useNavigate } from "react-router-dom";

const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login request
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // Build user object and set it in parent
        const loggedUser = { name: res.data.userName, email: res.data.userEmail };
        setUser(loggedUser);

        // Navigate to home page
        navigate("/home");
      } else {
        // Register request
        await axios.post("http://localhost:5000/api/auth/register", formData);
        alert("Registered successfully. Now login.");
        setIsLogin(true);
      }

      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert("Error: " + msg);
    }
  };

  return (
    <div style={{ margin: 30 }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </div>
      </form>

      <p style={{ marginTop: 10 }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default AuthPage;
