const asyncHandler = require("express-async-handler");
const Connection = require("../models/connection");
const ConnectionRequest = require("../models/connectionRequest");

const createConnction = asyncHandler(async (req, res) => {
  try {
    const { connectionReqId } = req.body;
    const connReq = await ConnectionRequest.findOne({
      where: { id: connectionReqId },
    });

    const data = {
      user: connReq.user,
      withUser: connReq.withUser,
    };

    const connData = await Connection.create(data);

    return res.status(201).send({
      status: true,
      msg: "Connection Created Successfully!",
      connReqData: connData,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

const fetchConnById = asyncHandler(async (req, res) => {
  try {
    const connId = req.params.connId;

    const findConnData = await Connection.findOne({
      where: { id: connId },
    });

    if (!findConnData) {
      return res.status(404).send({
        status: false,
        msg: "Connection Data not found!",
      });
    }

    return res.status(201).send({
      status: true,
      msg: "Connection fetch Successfully!",
      findConnData: findConnData,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

const deleteConnById = asyncHandler(async (req, res) => {
  try {
    const connId = req.params.connId;

    await Connection.destroy({
      where: { id: connId },
    });

    return res.status(200).send({
      status: true,
      msg: "Connection deleted Successfully!",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

module.exports = { createConnction, fetchConnById, deleteConnById };