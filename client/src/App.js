import "./assets/css/styles.css";
import "./assets/css/style.scss";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/partials/404";
import ForgotPass from "./components/modules/ForgotPass";
import SentMailMessage from "./components/modules/SentMailMessage";
import PasswordReset from "./components/modules/PasswordReset";
import ChatPage from "./pages/ChatPage";
import SuccessfulPasswordChangeMsg from "./components/modules/SuccessfulPasswordChangeMsg";
import HomePage from "./pages/HomePage";
import RoomPage from "./components/screens/RoomPage";
import Login from "./components/modules/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import PrivacyPolicy from "./components/privacy-policy and T&C/PrivacyPolicy";
import TermsCondition from "./components/privacy-policy and T&C/TermsCondition";
import RefundPolicy from "./components/miscellaneous/RefundPolicy";
import UploadPhoto from "./components/uploadPhoto/UploadPhoto";
import Profile from "./components/dashboard/Profile";
import SearchPreferences from "./components/dashboard/SearchPreferences";
import Settings from "./components/dashboard/Settings";
import More from "./components/dashboard/More";
import Matches from "./components/dashboard/Matches";
import Requests from "./components/dashboard/Requests";
import PaymentSuccess from "./components/miscellaneous/PaymentSuccess";
import PaymentCancel from "./components/miscellaneous/PaymentCancel";
import SubscriptionPlan from "./components/miscellaneous/SubscriptionPlan";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "./config/config";
import Payment from "./components/miscellaneous/Payment";
import Completion from "./components/miscellaneous/Completion";

function App() {
  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");
  const [stripePromise, setStripePromise] = useState(null);
  const host = config.BCKHOST;

  useEffect(() => {
    const cnfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(`${host}/config`, cnfig)
      .then(({ data }) => {
        const { publishableKey } = data;
        setStripePromise(loadStripe(publishableKey));
      })
      .catch((e) => {
        console.log(e.message);
      });

    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <div className="container">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/404" element={<NotFound />} />
          <Route exact path="/forgotpass" element={<ForgotPass />} />
          <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route exact path="/refund-policy" element={<RefundPolicy />} />
          <Route exact path="/terms-con" element={<TermsCondition />} />

          <Route
            exact
            path={`/resetpass/${token}`}
            element={<PasswordReset />}
          />

          <Route exact path="/mailsent" element={<SentMailMessage />} />
          <Route
            exact
            path="/success-pass-change"
            element={<SuccessfulPasswordChangeMsg />}
          />
          {token !== undefined && userInfo !== undefined && (
            <>
              <Route
                exact
                path="/new-chats"
                element={<ChatPage token={token} userInfo={userInfo} />}
              />

              <Route
                exact
                path="/upload-photo"
                element={<UploadPhoto token={token} />}
              />
              <Route
                exact
                path="/Dashboard"
                element={<Dashboard token={token} />}
              />
              <Route
                exact
                path="/video-call"
                element={<RoomPage token={token} />}
              />
              <Route
                exact
                path="/Profile"
                element={<Profile token={token} />}
              />
              <Route
                exact
                path="/Search-Preferences"
                element={<SearchPreferences token={token} />}
              />
              <Route
                exact
                path="/Settings"
                element={<Settings token={token} />}
              />
              <Route exact path="/More" element={<More token={token} />} />
              <Route
                exact
                path="/Matches"
                element={<Matches token={token} />}
              />
              <Route
                exact
                path="/Requests"
                element={<Requests token={token} />}
              />

              <Route
                exact
                path="/success"
                element={<PaymentSuccess token={token} />}
              />

              <Route
                exact
                path="/cancel"
                element={<PaymentCancel token={token} />}
              />

              <Route
                exact
                path="/subscribe-plan"
                element={<SubscriptionPlan token={token} />}
              />

              <Route
                exact
                path="/payment"
                element={
                  <Payment token={token} stripePromise={stripePromise} />
                }
              />

              <Route
                exact
                path="/completion"
                element={
                  <Completion token={token} stripePromise={stripePromise} />
                }
              />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
