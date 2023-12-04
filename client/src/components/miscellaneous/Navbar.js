import React from "react";
import Header from "./Header";

const Navbar = () => {
  return (
    <div>
      <Header />
      <div className="navbar-con">
        <div>
          <p style={{ color: "#c2485d", fontSize: "18px" }}>Indian Diaspora</p>
          <p style={{ color: "orange", fontSize: "15px" }}>MATRIMONY</p>
        </div>
        <div className="navbar-con-1">
          <p>Already a member?</p>
          <button>LOGIN</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
