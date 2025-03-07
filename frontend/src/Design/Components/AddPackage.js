import React, { useState } from "react";

const API_URL = "http://localhost:5011"; // Backend API URL

function AddPackage() {
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [message, setMessage] = useState("");

  const owner = localStorage.getItem("username"); // Get username from localStorage

  const handleAddItem = () => {
    if (item) {
      setItems([...items, item]);
      setItem(""); // Clear the item input
    }
  };

  const handleAddPackage = async () => {
    try {
      const response = await fetch(`${API_URL}/addPackage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName,
          price,
          items,
          owner,
        }),
      });

      const data = await response.json();
      setMessage(data.message || data.error);

      if (response.ok) {
        // Reset fields after successful submission
        setPackageName("");
        setPrice("");
        setItems([]);
      }
    } catch (error) {
      setMessage("Failed to add package");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h4>Add Package</h4>
      <div className="mb-3">
        <label>Package Name</label>
        <input
          type="text"
          className="form-control"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Price</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Items</label>
        <div>
          <input
            type="text"
            className="form-control"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Enter an item"
          />
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
        <ul>
          {items.map((i, index) => (
            <li key={index}>{i}</li>
          ))}
        </ul>
      </div>
      <button className="btn btn-success" onClick={handleAddPackage}>
        Add Package
      </button>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </div>
  );
}

export default AddPackage;
