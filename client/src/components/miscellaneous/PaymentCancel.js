// import React, { useEffect, useState } from "react";
// import config from "../../config/config";
// import axios from "axios";
// import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import cancel from "../../assets/cancel.png";


function PaymentCancel({ token }) {
  const navigate = useNavigate();
  // const [sessionId, setSessionId] = useState("");
  // const host = config.BCKHOST;
  // const toast = useToast();
  // const paymentId = localStorage.getItem("paymentId")

  // const handlePaymentSuccess = () => {
  //   const cnfig = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   const sendData = { sessionId: sessionId };

  //   axios
  //     .put(`${host}/payment-status/${paymentId}`, sendData, cnfig)
  //     .then(({ data }) => {
  //       if (data.status === false) {
  //         navigate("/Dashboard");
  //         toast({
  //           title: "Payment Failed!",
  //           status: "warning",
  //           duration: 3000,
  //           isClosable: true,
  //           position: "top-right",
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       toast({
  //         title: err.message,
  //         status: "warning",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top-right",
  //       });
  //     });
  // };

  // useEffect(() => {
  //   const cnfig = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   axios
  //     .get(`${host}/fetch-stripe-payment/${paymentId}`, cnfig)
  //     .then(({ data }) => {
  //       if (data.status === true) {
  //         setSessionId(data.paymentData.subscription.sessionId);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       toast({
  //         title: err.message,
  //         status: "warning",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top-right",
  //       });
  //     });

  //   // eslint-disable-next-line
  // }, []);

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
            src={cancel}
            alt=""
            style={{ height: "220px", width: "220px" }}
          />
          <h3
            style={{
              color: "red",
              marginTop:"20px"
            }}
          >
            Payment Failed!!
          </h3>
          <button
            onClick={() => navigate("/Dashboard")}
            className="btn btn-primary mt-5"
          >
            Back To Dashboard
          </button>
        </>
      ) : (
        navigate("/404")
      )}
    </div>
  );
}

export default PaymentCancel;
