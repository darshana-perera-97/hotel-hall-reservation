import React, { useState } from "react";

const API_URL = "http://localhost:5011"; // Backend API URL

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message || data.error);

      // If login is successful, save username to localStorage
      if (response.ok) {
        localStorage.setItem("username", username); // Store the username in localStorage
      }
    } catch (error) {
      setMessage("Login failed");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h4>Login</h4>
      <div className="mb-3">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-success" onClick={handleLogin}>
        Login
      </button>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </div>
  );
}

export default Login;
