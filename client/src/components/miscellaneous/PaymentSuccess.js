import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess({ token }) {
  const navigate = useNavigate();
  return (
    <div>
      {token ? (
        <h1
          style={{
            color: "green",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Payment Success!!
        </h1>
      ) : (
        navigate("/404")
      )}
    </div>
  );
}

export default PaymentSuccess;
