import React from "react";

const Middlebar = () => {
  return (
    <div>
      <img
        src="/shaadi.png"
        alt="shaadiPhoto"
        style={{ objectFit: "cover", width: "100%" }}
      />
      <div className="co-ho">
        <form className="form-co-ho">
          <div className="form-main">
            <label htmlFor="inp1" className="form-label-1">
              I'm looking for
            </label>
            <input type="text" className="looking-inp" id="inp1" />
          </div>
          <div className="form-main">
            <label htmlFor="inp2" className="form-label-2">
              Aged
            </label>
            <div className="form-aged-inp">
              <input type="text" className="aged-inp" id="inp2" />
              <p>to</p>
              <input type="text" className="aged-inp" id="inp2" />
            </div>
          </div>
          <div className="form-main">
            <label htmlFor="inp3" className="form-label-3">
              Community
            </label>
            <input type="text" className="looking-inp" id="inp3" />
          </div>
          <div className="form-main">
            <label htmlFor="inp4" className="form-label-4">
              Living in
            </label>
            <input type="text" className="looking-inp" id="inp4" />
          </div>
          <button type="button" className="btn btn-info">
            Let's Begin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Middlebar;
