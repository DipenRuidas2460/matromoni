import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/miscellaneous/Navbar";
import Carousel from "../components/carousel/Carousel";
import Middlebar from "../components/miscellaneous/Middlebar";
import Info from "../components/miscellaneous/Info";
import MidInfo from "../components/miscellaneous/MidInfo";
import CardInfo from "../components/cardInfo/CardInfo";
import Footer from "../components/miscellaneous/Footer";
import CountryAndPrivacy from "../components/miscellaneous/CountryAndPrivacy";

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
      <Middlebar />
      <div className="parent-box">
        <MidInfo />
        <Info />
        <Carousel />
        <CardInfo />
        <CountryAndPrivacy />
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
