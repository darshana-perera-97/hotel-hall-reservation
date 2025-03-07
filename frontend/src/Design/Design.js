import React from "react";
import Register from "./Components/Register";
import Login from "./Components/Login";
import AddPackage from "./Components/AddPackage";
import MyPackages from "./Components/MyPackages";

export default function Design() {
  return (
    <div>
      <Register />
      <Login />
      <AddPackage />
      <MyPackages />
    </div>
  );
}
