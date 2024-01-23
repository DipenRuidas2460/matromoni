import { useCallback, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import config from "../../config/config";

function Payment({ token, stripePromise }) {
  const [clientSecret, setClientSecret] = useState("");
  const [elementsOptions, setElementsOptions] = useState(null);
  const host = config.BCKHOST;
  const planId = localStorage.getItem("planId");

  const createPaymentData = useCallback(async () => {
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
          console.log(data.clientSecret);
          setClientSecret(data.clientSecret);
          setElementsOptions({ clientSecret: data.clientSecret });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [host, token, planId]);

  useEffect(() => {
    createPaymentData();
    // eslint-disable-next-line
  }, []);

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
      {elementsOptions && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={elementsOptions}
          key={clientSecret}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
