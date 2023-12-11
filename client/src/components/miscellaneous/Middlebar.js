import React from "react";

const Middlebar = () => {
  return (
    <div className="middlebar-main">
      <img
        className="middlebar-main-img"
        src="/shaadi.png"
        alt="shaadiPhoto"
      />
      <div className="co-ho">
        <form className="form-co-ho">
          <div className="form-main">
            <label htmlFor="inp1" className="form-label-1">
              I'm looking for
            </label>
            <input type="text" className="looking-inp" id="inp1" required/>
          </div>
          <div className="form-main">
            <label htmlFor="inp2" className="form-label-2">
              Aged
            </label>
            <div className="form-aged-inp">
              <input type="text" className="aged-inp" id="inp2" required/>
              <p>to</p>
              <input type="text" className="aged-inp" id="inp2" required/>
            </div>
          </div>
          <div className="form-main">
            <label htmlFor="inp3" className="form-label-3">
              Community
            </label>
            <input type="text" className="looking-inp" id="inp3" required/>
          </div>
          <div className="form-main">
            <label htmlFor="inp4" className="form-label-4">
              Living in
            </label>
            <input type="text" className="looking-inp" id="inp4" required/>
          </div>
          <button
            type="button"
            className="btn btn-info"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Let's Begin
          </button>
          <div
            className="modal fade"
            id="exampleModal"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    This Profile is for
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body"></div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Middlebar;
