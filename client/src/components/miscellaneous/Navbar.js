import React from "react";
import Header from "./Header";

const Navbar = () => {
  return (
    <div>
      <Header />
      <div className="navbar-con">
        <img
          className="navbar-logo-img"
          src="/diaspora.png"
          alt="diaspora-logo"
        />

        <div className="navbar-con-1">
          <p className="navbar-para-three">Already a member?</p>
          <button className="navbar-con-1-button">LOGIN</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
