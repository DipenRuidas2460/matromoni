import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import config from "../../config/config";

function Payment({ token, stripePromise }) {
  const [clientSecret, setClientSecret] = useState("");
  const host = config.BCKHOST;

  useEffect(() => {
    const planId = localStorage.getItem("planId");
    const cnfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(`${host}/create-stripe-payment`, { planId: planId }, cnfig)
      .then(({ data }) => {
        if (data.status === true) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, host]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1>Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
