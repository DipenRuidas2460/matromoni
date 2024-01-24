import { useEffect, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import config from "../../config/config";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Payment({ token, stripePromise }) {
  const [clientSecret, setClientSecret] = useState(null);
  const host = config.BCKHOST;
  const planId = localStorage.getItem("planId");
  const toast = useToast();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    if (isMounted.current) {
      function getClientSeceret() {
        try {
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
            });
        } catch (err) {
          console.log(err.message);
          toast({
            title: err.message,
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      }

      getClientSeceret();
      isMounted.current = false;
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {token ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1>Payment</h1>
          <p className="mb-2 mt-3">Do not refresh page or not press back button!</p>
          {clientSecret && stripePromise && (
            <Elements
              options={options}
              stripe={stripePromise}
            >
              <CheckoutForm />
            </Elements>
          )}
        </div>
      ) : (
        navigate("/404")
      )}
    </div>
  );
}

export default Payment;
