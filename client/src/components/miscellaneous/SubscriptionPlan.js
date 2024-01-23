import React, { useCallback, useEffect, useState } from "react";
import config from "../../config/config";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function SubscriptionPlan({ token }) {
  const [planInfo, setPlanInfo] = useState("");
  const host = config.BCKHOST;
  const toast = useToast();
  const navigate = useNavigate()

  useEffect(() => {
    const cnfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .get(`${host}/fetchAllPlan`, cnfig)
      .then(({ data }) => {
        if (data.status === true) {
          setPlanInfo(data.planData);
        }
      })
      .catch((err) => {
        console.log(err.message);
        toast({
          title: err.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });

    // eslint-disable-next-line
  }, []);

  const checkOut = useCallback((planId) => {
    localStorage.setItem("planId", planId);
    navigate("/payment")
  }, [navigate])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "blue",
        height: "100vh",
      }}
    >
      {planInfo &&
        planInfo.map((el, index) => (
          <div
            className="card"
            style={{
              width: "25%",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            key={index}
          >
            <img
              src={el.logo}
              className="card-img-top"
              alt=""
              style={{ height: "280px", width: "320px", marginTop: "5px" }}
            />
            <div
              className="card-body"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h5 className="card-title">{el.planName.toUpperCase()}</h5>
              <p className="card-text p-3">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <h5 className="card-title mb-3">₹ {el.amount}/month</h5>

              <button
                type="button"
                className="btn btn-success mt-3"
                onClick={() => checkOut(el.id)}
              >
                START
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default SubscriptionPlan;
