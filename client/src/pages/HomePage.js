import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/miscellaneous/Navbar";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/404");
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div>
        <img
          src="https://www.shaadisquad.com/images/slider/1.jpg"
          alt="shaadiPhoto"
          style={{objectFit:"cover"}}
        />
        <div className="co-ho">
          sam
        </div>
      </div>
      <div className="home-conten">
          ple
      </div>
    </div>
  );
}

export default HomePage;
