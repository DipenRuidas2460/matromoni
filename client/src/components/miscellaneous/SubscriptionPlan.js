import React, { useState } from "react";
import basic from "../../assets/basic.svg";
import premium from "../../assets/pro.svg";
import config from "../../config/config";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

function SubscriptionPlan({ token }) {
  const [planType, setPlanType] = useState("");
  const host = config.BCKHOST;
  const toast = useToast();
  const data = [
    {
      id: 1,
      src: basic,
      title: "Basic",
      price: 129,
    },
    {
      id: 2,
      src: premium,
      title: "Premium",
      price: 399,
    },
  ];

  const checkOut = (plan) => {
    const cnfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(`${host}/create-stripe-payment`, { plan: plan }, cnfig)
      .then(({ data }) => {
        console.log(data);
        if (data.status === true) {
          if (data.paymentData.plan === 399) {
            setPlanType("premium");
          } else if (data.paymentData.plan === 129) {
            setPlanType("basic");
          }
        //   window.location = data.session.url;
        } else {
          toast({
            title: "Something Went Wrong!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
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
  };

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
      {data.map((el) => (
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
          key={el.id}
        >
          <img
            src={el.src}
            className="card-img-top"
            alt=""
            style={{ height: "280px", width: "320px" }}
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
            <h5 className="card-title">{el.title}</h5>
            <p className="card-text p-3">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <h5 className="card-title mb-3">₹ {el.price}/month</h5>
            {planType ? (
              <button type="button" className="btn btn-primary mt-3">
                Subscribed
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success mt-3"
                onClick={() => checkOut(el.price)}
              >
                START
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscriptionPlan;
