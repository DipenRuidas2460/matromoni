import React from "react";
import Header from "./Header";

const Navbar = () => {
  return (
    <div>
      <Header />
      <div className="navbar-con">
        <div className="navbar-para-parent">
          <p className="navbar-para-one">Indian Diaspora</p>
          <p className="navbar-para-two">MATRIMONY</p>
        </div>
        <div className="navbar-con-1">
          <p className="navbar-para-three">Already a member?</p>
          <button className="navbar-con-1-button">LOGIN</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
