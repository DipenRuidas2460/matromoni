import React, { useEffect } from "react";
import Login from "../components/modules/auth/Login";
import { useNavigate } from "react-router-dom";

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
      <Login />
    </div>
  );
}

export default HomePage;
