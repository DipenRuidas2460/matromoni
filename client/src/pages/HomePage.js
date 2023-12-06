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
    <div className="home-main">
      <Navbar />
      <div>
        <img
          src="https://i.pinimg.com/originals/0a/53/17/0a5317e60c5b378846fe384e23671f6c.png"
          alt="shaadiPhoto"
          style={{ objectFit: "cover", width:"100%"}}
        />
        <div className="co-ho">
          <form className="form-co-ho">
            <div className="form-main">
              <label htmlFor="inp1" className="form-label-1">
                I'am looking for
              </label>
              <input type="text" className="looking-inp" id="inp1" />
            </div>
            <div className="form-main">
              <label htmlFor="inp2" className="form-label-2">
                Aged
              </label>
              <div className="form-aged-inp">
                <input type="text" className="aged-inp" id="inp2" />
                <p className="p-2">to</p>
                <input type="text" className="aged-inp" id="inp2" />
              </div>
            </div>
            <div className="form-main">
              <label htmlFor="inp3" className="form-label-3">
                Community
              </label>
              <input type="text" className="looking-inp" id="inp3" />
            </div>
            <div className="form-main">
              <label htmlFor="inp4" className="form-label-4">
                Living in
              </label>
              <input type="text" className="looking-inp" id="inp4" />
            </div>
            <button type="button" className="btn btn-info">
              Let's Begin
            </button>
          </form>
        </div>
      </div>
      <div className="parent-box">
        <div className="home-conten">
          <div className="home-con-heading">
            Why Choose Indian Diaspora
          </div>
          <div className="diapo-parent">
            <div className="diapo-boxes">Global Diaspora Indian Roots</div>
            <div className="diapo-boxes">100% Verified Profiles</div>
            <div className="diapo-boxes">Review your maches for free</div>
            <div className="diapo-boxes">Voice & Video Calling Features</div>
          </div>
        </div>
        <div className="home-conten-box1"></div>
        <div className="home-conten-box2"></div>
        <div className="home-conten-box3"></div>
        <div className="home-conten-box4"></div>
        <div className="home-conten-box5"></div>
      </div>
    </div>
  );
}

export default HomePage;
