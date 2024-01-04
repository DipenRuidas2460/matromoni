import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import usePasswordToggle from "../../../hook/usePasswordToggle";
import { useToast } from "@chakra-ui/react";
import config from "../../../config/config";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    // photo: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordInputType, ToggleIcon] = usePasswordToggle();
  const [passwordInputType1, ToggleIcon1] = usePasswordToggle();

  const navigate = useNavigate();
  const toast = useToast();
  const host = config.BCKHOST;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password and Confirm Password not matched!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      axios
        .post(`${host}/customer/register`, formData)
        .then((res) => {
          if (res.data.status === 200) {
            localStorage.setItem("userInfo", JSON.stringify(res.data.registerUserData));
            localStorage.setItem("token", res.data.token);
            toast({
              title: "Account Created Sucessfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
            navigate("/");
          }
        })
        .catch((err) => {
          if (err.response.data.status === "email conflict") {
            toast({
              title: "Email is already present!",
              status: "warning",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          } else if (err.response.data.status === "phone conflict") {
            toast({
              title: "Phone Number is already present!",
              status: "warning",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          } else {
            console.log(err.message);
            toast({
              title: "Something Went Wrong!",
              status: "warning",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          }
          navigate("/register");
        });
    }
  };

  return (
    <>
      <div className="container-fluid" id={"login"}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-theme">
                <div className="card-header">
                  <h4>Create an account for Matromoni</h4>
                </div>
                <div className="card-body">
                  <label className={"w-100"}>
                    <p>First Name*</p>
                    <input
                      className={"form-control"}
                      type={"text"}
                      id={"firstName"}
                      name={"firstName"}
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className={"w-100"}>
                    <p>Last Name*</p>
                    <input
                      className={"form-control"}
                      type={"text"}
                      id={"lastName"}
                      name={"lastName"}
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className={"w-100 mt-1"}>
                    <p>Email*</p>
                    <input
                      className={"form-control"}
                      type={"email"}
                      value={formData.email}
                      onChange={handleChange}
                      id="email"
                      name="email"
                      required
                    />
                  </label>

                  <label className={"w-100 mt-1"}>
                    <p>Enter Phone Number*</p>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      id="phoneNumber"
                      name="phoneNumber"
                      minLength={10}
                      required
                    />
                  </label>

                  {/* <label className={"w-100 mt-1"}>
                    <p>Profile Picture*</p>
                    <input
                      className={"form-control"}
                      type={"file"}
                      value={formData.photo}
                      accept=".jpg,.gif,.png"
                      onChange={handleChange}
                      id="photo"
                      name="photo"
                      required
                    />
                  </label> */}

                  {/* <label className={"w-100 mt-1"}>
                    <p>User Type*</p>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="role"
                      onChange={handleChangeRole}
                      value={formData.role}
                    >
                      <option value="customer">Customer</option>
                      <option value="carrier">Carrier</option>
                    </select>
                  </label> */}

                  <label className={"w-100 mt-1"}>
                    <p>Password*</p>
                  </label>
                  <div className="input-group mb-3">
                    <input
                      className={"form-control"}
                      type={passwordInputType}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange(e)}
                      minLength={8}
                      maxLength={16}
                      required
                    />
                    <span className="input-group-text">{ToggleIcon}</span>
                  </div>

                  <label className={"w-100 mt-1"}>
                    <p>Confirm Password*</p>
                  </label>
                  <div className="input-group mb-3">
                    <input
                      className={"form-control"}
                      type={passwordInputType1}
                      placeholder="Enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      id="confirmPassword"
                      name="confirmPassword"
                      minLength={8}
                      maxLength={16}
                      required
                    />
                    <span className="input-group-text">{ToggleIcon1}</span>
                  </div>

                  <div className="d-grid mt-2">
                    <button className={"btn btn-outline-warning"}>
                      Register
                    </button>
                  </div>
                  <p className="mt-2" style={{ color: "white" }}>
                    Already have a account please click here to{" "}
                    <span onClick={()=>navigate('/')} style={{ color: "yellow", cursor:'pointer' }}>
                      LogIn
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
