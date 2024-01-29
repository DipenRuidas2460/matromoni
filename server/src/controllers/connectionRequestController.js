const asyncHandler = require("express-async-handler");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sequelize = require("../config/dbConfig");
const Partner = require("../models/partner");

const sendConnRequest = asyncHandler(async (req, res) => {
  try {
    const { withUserId } = req.body;
    const data = {
      user: req.person.id,
      withUser: withUserId,
    };

    const existingRequest = await ConnectionRequest.findOne({
      where: {
        user: req.person.id,
        withUser: withUserId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent!" });
    }

    const receiverProfile = await User.findOne({
      where: {
        id: withUserId,
      },
    });

    if (!receiverProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

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

const acceptConnRequest = asyncHandler(async (req, res) => {
  try {
    const senderProfileId = req.params.senderProfileId;

    const partnerRequest = await ConnectionRequest.findOne({
      where: {
        user: senderProfileId,
        withUser: req.person.id,
      },
    });

    if (!partnerRequest) {
      return res.status(404).json({ error: "Connection request not found!" });
    }

    await sequelize.transaction(async (t) => {
      await Partner.create(
        { userId: senderProfileId, partnerId: req.person.id },
        { transaction: t }
      );
      await ConnectionRequest.destroy({
        where: { user: senderProfileId, withUser: req.person.id },
        transaction: t,
      });
    });

    res.json({
      message: `You have accepted the partner's request from profile with ID=${senderProfileId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

const getConnRequests = asyncHandler(async (req, res) => {
  try {
    const relationships = await ConnectionRequest.findAll({
      attributes: ["id", "user"],
      where: {
        withUser: req.person.id,
      },
    });

    if (relationships.length === 0) {
      return res.status(404).send({
        status: false,
        msg: "Connection Request Data not found!",
      });
    }

    return res.status(201).send({
      status: true,
      msg: "Connection Request fetch Successfully!",
      relationships,
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

const getSendedConnRequests = asyncHandler(async (req, res) => {
  try {
    const sentConnRequests = await ConnectionRequest.findAll({
      attributes: ["id", "withUser"],
      where: {
        user: req.person.id,
      },
    });

    if (sentConnRequests.length === 0) {
      return res.status(404).send({
        status: false,
        msg: "Connection Request Data not found!",
      });
    }

    return res.status(201).send({
      status: true,
      msg: "Connection Request fetch Successfully!",
      sentConnRequests,
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

const getPartners = asyncHandler(async (req, res) => {
  try {
    const partners = await Partner.findAll({
      attributes: ["id", "userId", "partnerId"],
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
      where: {
        [sequelize.Op.or]: [
          { userId: req.person.id },
          { partnerId: req.person.id },
        ],
      },
      raw: true,
    });

    const formattedPartners = partners.map((partnership) => {
      const partnerProfileId =
        partnership.userId === req.person.id
          ? partnership.partnerId
          : partnership.userId;

      return {
        id: partnership.id,
        partnerProfileId,
      };
    });

    res.json(formattedPartners);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
    const withUserId = req.params.withUserId;

    const result = await ConnectionRequest.destroy({
      where: { user: req.person.id, withUser: withUserId },
    });

    if (result === 0) {
      return res.status(404).json({ error: "Connection request not found!" });
    }

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

const removePartner = asyncHandler(async (req, res) => {
  try {
    const partnershipId = req.params.partnershipId;

    const result = await Partner.destroy({
      where: {
        id: partnershipId,
      },
    });

    if (result === 0) {
      return res.status(404).json({ error: "Partner not found!" });
    }

    return res.json({ message: "Partner deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  sendConnRequest,
  getConnRequests,
  updateConnRequestById,
  deleteConnRequestById,
  getSendedConnRequests,
  acceptConnRequest,
  getPartners,
  removePartner,
};
