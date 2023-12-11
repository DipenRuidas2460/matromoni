import React from "react";

function CardInfo() {
  return (
    <div className="home-conten-box3">
      <h2 className="stories"> How it Works ?</h2>
      <div className="parent-card-info">
        <div className="child-card-info">
          <div className="child-card-img">
            <img src="/card-photo-1.png" alt="card-1-pic" />
          </div>
          <div className="child-text">
            <strong>Create a Profile</strong>
            <p>
              create your profile in seconds with our easy sign-up. Don't forget
              to add photo!
            </p>
          </div>
        </div>
        <img
          className="child-first-arrow"
          src="/arrow-first.png"
          alt="first-arrow"
        />
        <div className="child-card-info">
          <div className="child-card-img">
            <img src="/card-photo-2.png" alt="card-2-pic" />
          </div>

          <div className="child-text">
            <strong>Browse Photos</strong>
            <p>
              Search our large member base with ease, with a range of
              preferences and settings.
            </p>
          </div>
        </div>
        <img
          className="child-second-arrow"
          src="/arrow-second.png"
          alt="second-arrow"
        />
        <div className="child-card-info">
          <div className="child-card-img">
            <img src="/card-photo-3.png" alt="card-3-pic" />
          </div>

          <div className="child-text">
            <strong>Start Communicating</strong>
            <p>
              Send a message or interest to start communication with members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardInfo;
