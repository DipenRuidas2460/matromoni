import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/miscellaneous/Navbar";
import Carousel from "../components/carousel/Carousel";
import Middlebar from "../components/miscellaneous/Middlebar";
import Info from "../components/miscellaneous/Info";
import MidInfo from "../components/miscellaneous/MidInfo";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/404");
    }
  }, [navigate]);

  return (
    <div className="home-main">
      <Navbar />
      <Middlebar/>
      <div className="parent-box">
        <MidInfo/>
        <Info/>
        <Carousel />
        <div className="home-conten-box3"></div>
        <div className="home-conten-box4"></div>
        <div className="home-conten-box5"></div>
      </div>
    </div>
  );
}

export default HomePage;
