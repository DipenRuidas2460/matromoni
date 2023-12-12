import React from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleClickLogin = () => {
    navigate("/login")
  };

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
          <button className="navbar-con-1-button" onClick={handleClickLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
