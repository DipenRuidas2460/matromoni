import React from "react";
import { Link } from "react-router-dom";

function CountryAndPrivacy() {
  return (
    <div className="home-conten-box4">
      <div className="box-4-main">
        <div className="box4-child-info">
          <h6>Explore by Regions</h6>
          <ul>
            <li>USA</li>
            <li>UK</li>
            <li>Canada</li>
            <li>Australia</li>
            <li>Dubai</li>
          </ul>
        </div>
        <div className="box4-child-info">
          <h6>Explore by Regions</h6>
          <ul>
            <li>Singapore</li>
            <li>Hong Kong</li>
            <li>Europe</li>
            <li>Jamaica</li>
            <li>Guyana</li>
          </ul>
        </div>
        <div className="box4-child-info">
          <h6>Information</h6>
          <ul>
            <li>About Us</li>
            <li>Member Fees</li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
            <li><Link to="/terms-con">Terms & Condition</Link></li>
          </ul>
        </div>
        <div className="box4-child-info">
          <h6>Help & Support</h6>
          <ul>
            <li>24x7 Live Help</li>
            <li>Contact Us</li>
            <li>Feedback</li>
            <li>FAQ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CountryAndPrivacy;
