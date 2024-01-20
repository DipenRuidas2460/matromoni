import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import success from "../../assets/success.png";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import config from "../../config/config";

function PaymentSuccess({ token }) {
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const host = config.BCKHOST;
  const toast = useToast();

  const handlePaymentSuccess = () => {
    const cnfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const sendData = { userId: userId, sessionId: sessionId };

    axios
      .put(`${host}/payment-status`, sendData, cnfig)
      .then(({ data }) => {
        if (data.status === true) {
          navigate("/Dashboard");
          toast({
            title: "Payment Success!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          navigate("/Dashboard");
          toast({
            title: "Payment Failed!",
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

  useEffect(() => {
    const cnfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .get(`${host}/fetch-stripe-payment`, cnfig)
      .then(({ data }) => {
        if (data.status === true) {
          setSessionId(data.paymentData.subscription.sessionId);
          setUserId(data.paymentData.userId);
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {token ? (
        <>
          <img
            src={success}
            alt=""
            style={{ height: "220px", width: "220px" }}
          />
          <h3
            style={{
              color: "green",
            }}
          >
            Payment Success!!
          </h3>
          <button
            onClick={() => handlePaymentSuccess()}
            className="btn btn-primary mt-5"
          >
            Proceed
          </button>
        </>
      ) : (
        navigate("/404")
      )}
    </div>
  );
}

export default PaymentSuccess;
