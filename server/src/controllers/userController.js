const Customer = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  checkPassword,
  encryptPassword,
  generateString,
} = require("../helper/side");
const moment = require("moment");
const { sendMail } = require("../helper/sendMail");
const { Op } = require("sequelize");

const secretKey = process.env.TOKEN_secret_key;
const expiresIn = "24h";

const addUser = asyncHandler(async (req, res) => {
  try {
    const reqBody = req.body;

    const currentDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD, HH:mm");

    const findEmail = await Customer.findOne({
      where: { email: reqBody.email },
    });

    const findPhoneNumber = await Customer.findOne({
      where: { phoneNumber: reqBody.phoneNumber },
    });

    if (findEmail) {
      return res
        .status(409)
        .json({ status: "email conflict", msg: "Email is already present!" });
    }

    if (findPhoneNumber) {
      return res.status(409).json({
        status: "phone conflict",
        msg: "Phone Number is already present!",
      });
    }

    reqBody.password = await encryptPassword(reqBody.password);

    const userDetails = await Customer.create({
      ...reqBody,
      createdTime: currentDate,
    });
    const response = await userDetails.save();

    const token = jwt.sign(
      { id: userDetails.id, role: userDetails.role },
      secretKey,
      { expiresIn }
    );

    const mailData = {
      respMail: reqBody.email,
      subject: "Welcome",
      text: `Hi, ${reqBody.fullName}. Welcome to Matromoni Site.`,
    };
    await sendMail(mailData);

    if (response) {
      const { id, fullName, email, phoneNumber, role, photo } = response;

      const registerUserData = {
        id,
        fullName,
        email,
        phoneNumber,
        role,
        photo,
      }

      res.header("Authorization", `Bearer ${token}`);

      return res.status(201).json({
        status: 200,
        registerUserData,
        id,
        fullName,
        email,
        phoneNumber,
        role,
        photo,
        token,
        message: "User successfully created!",
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "User is not created!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "error",
        message: "Send valid email and Password",
      });
    }

    const userDetails = await Customer.findOne({ where: { email: email } });

    if (!userDetails) {
      return res
        .status(401)
        .json({ status: "error", message: "email incorrect" });
    }

    const isPassMatch = await checkPassword(password, userDetails.password);

    if (!isPassMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect password, try again" });
    }

    const token = jwt.sign(
      { id: userDetails.id, role: userDetails.role },
      secretKey,
      { expiresIn }
    );
    const data = {
      userId: userDetails.id,
      fullName: userDetails.fullName,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      role: userDetails.role,
      photo: userDetails.photo,
      token: token,
    };

    res.header("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      status: "success",
      token,
      userdata: data,
      message: "Login successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, data: error.message, message: "Login fail" });
  }
});

const logOut = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      msg: "Successfully Logged Out!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, data: error.message, message: "LogOut Failed!" });
  }
});

const forgetPass = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const userDetails = await Customer.findOne({
      where: { email: email },
    });
    if (!userDetails) {
      return res.status(404).json({ status: false, message: "No user found" });
    }

    const token = generateString(20);
    await Customer.update({ fpToken: token }, { where: { email: email } });

    const mailData = {
      respMail: email,
      subject: "Forget Password",
      text: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="styles.css" />
    <title>Static Template</title>
  </head>
  <body>
    <h3>Click this link for changing Password</h3>
    <p>http://localhost:3000/resetpass/${token}</p>
  </body>
</html>
`,
    };
    await sendMail(mailData);

    return res.status(200).json({
      status: "success",
      token: token,
      message: "Check your email for reset link",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fpUpdatePass = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;

    const { token } = req.body;

    const userInfo = await Customer.findOne({ where: { fpToken: token } });
    if (!userInfo)
      return res
        .status(400)
        .json({ status: 400, message: "Wrong link or link expired!" });

    if (reqBody.password) {
      reqBody.password = await encryptPassword(reqBody.password);
    }

    const response = await Customer.update(
      { password: reqBody.password },
      {
        where: { fpToken: token },
      }
    );

    return res.status(201).json({
      status: response[0] === 0 ? 404 : 200,
      data: response,
      message:
        response[0] === 0
          ? "Nothing updated"
          : "User Password changed successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    let reqBody = req.body;

    if (reqBody.password) {
      reqBody.password = await encryptPassword(reqBody.password);
    }

    const response = await Customer.update(reqBody, {
      where: { id: req.person.id },
    });

    return res.status(201).json({
      status: response[0] === 0 ? 404 : 200,
      data: response,
      message: response[0] === 0 ? "Nothing updated" : "Successfully Updated!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const response = await Customer.findOne({
      where: { id: req.person.id },
      attributes: ["id", "fullName", "email", "phoneNumber", "role", "photo"],
    });

    return res.status(200).json({
      status: "success",
      data: response,
      message: response.length
        ? "Successfully fetch data"
        : "User Not Present!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          [Op.or]: [
            { fullName: { [Op.like]: `%${req.query.search}%` } },
            { email: { [Op.like]: `%${req.query.search}%` } },
          ],
        }
      : {};

    const response = await Customer.findAll({
      where: {
        ...keyword,
        id: { [Op.not]: req.person.id },
      },
    });

    return res.status(200).json({
      status: "success",
      data: response,
      message: response.length ? "Successfully fetch data" : "No data found",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      messageInfo: error,
    });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const response = await Customer.findOne({ where: { id: req.person.id } });

    const { oldPassword, password } = req.body;

    if (!response) {
      return res.status(404).json({
        status: false,
        message: "User not Found, Please Register first!",
      });
    }

    if (!oldPassword || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please add Old and new password!" });
    }

    const isPassMatch = await checkPassword(
      oldPassword.trim(),
      response.password
    );

    if (response && isPassMatch) {
      response.password = password;
      await response.save();
      return res.status(200).send({
        status: true,
        data: response,
        message: "password changed successfully!",
      });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "oldPassword is incorrect!!" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

module.exports = {
  login,
  addUser,
  forgetPass,
  fpUpdatePass,
  logOut,
  updateUser,
  getUserById,
  updatePassword,
  getAllUsers,
};
