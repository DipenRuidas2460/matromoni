const asyncHandler = require("express-async-handler");
const ConnectionRequest = require("../models/connectionRequest");

const createConnRequest = asyncHandler(async (req, res) => {
  try {
    const { withUserId } = req.body;
    const data = {
      user: req.person.id,
      withUser: withUserId,
    };

    const connReqData = await ConnectionRequest.create(data);

    return res.status(201).send({
      status: true,
      msg: "Connection Request Created Successfully!",
      connReqData: connReqData,
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

const fetchConnRequestById = asyncHandler(async (req, res) => {
  try {
    const connRequestId = req.params.connRequestId;

    const findReqData = await ConnectionRequest.findOne({
      where: { id: connRequestId },
    });

    if (!findReqData) {
      return res.status(404).send({
        status: false,
        msg: "Connection Request Data not found!",
      });
    }

    return res.status(201).send({
      status: true,
      msg: "Connection Request Created Successfully!",
      connReqData: connReqData,
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

const updateConnRequestById = asyncHandler(async (req, res) => {
  try {
    const connRequestId = req.params.connRequestId;
    const { status } = req.body;
    const updateReqData = await ConnectionRequest.update(
      { status: status },
      { where: { id: connRequestId } }
    );

    return res.status(200).json({
      status: updateReqData[0] === 0 ? 404 : 200,
      data: updateReqData,
      message:
        updateReqData[0] === 0
          ? "Nothing updated"
          : "Successfully Updated Connection Request Status!",
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

const deleteConnRequestById = asyncHandler(async (req, res) => {
  try {
    const connRequestId = req.params.connRequestId;

    await ConnectionRequest.destroy({
      where: { id: connRequestId },
    });

    return res.status(200).send({
      status: true,
      msg: "Connection Request deleted Successfully!",
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

module.exports = {
  createConnRequest,
  fetchConnRequestById,
  updateConnRequestById,
  deleteConnRequestById,
};
