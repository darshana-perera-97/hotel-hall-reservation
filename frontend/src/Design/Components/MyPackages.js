import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5011"; // Backend API URL

function MyPackages() {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState("");

  // Get username from localStorage
  const owner = localStorage.getItem("username");

  useEffect(() => {
    // Fetch the packages for the current owner from the backend
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/getPackagesByOwner?owner=${owner}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }

        const data = await response.json();
        setPackages(data);
      } catch (error) {
        setMessage(error.message || "Failed to fetch packages");
      }
    };

    if (owner) {
      fetchPackages();
    } else {
      setMessage("Please log in to view your packages.");
    }
  }, [owner]);

  return (
    <div className="card p-4 shadow">
      <h4>My Packages</h4>
      {message && <p className="text-danger">{message}</p>}
      {packages.length === 0 ? (
        <p>No packages found</p>
      ) : (
        <ul>
          {packages.map((pkg, index) => (
            <li key={index} className="mb-3">
              <h5>{pkg.packageName}</h5>
              <p>
                <strong>Price:</strong> {pkg.price}
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul>
                {pkg.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyPackages;
