const express = require("express");
const router = express.Router();

const {
  login,
  addUser,
  forgetPass,
  fpUpdatePass,
  logOut,
  updateUser,
  getUserById,
  updatePassword,
  getAllUsersByQuery,
} = require("../controllers/userController");

const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");

const { accessChat, fetchChats } = require("../controllers/chatController");

const { validateTokenMiddleware } = require("../middleware/auth");

const {
  createSearch,
  fetchAllSearch,
  updateSearch,
  deleteSearch,
  fetchSearchBySearchId,
} = require("../controllers/searchController");

const { getImage } = require("../helper/fileHelper");

const {
  createStripePayment,
  // paymentStatus,
  fetchPaymentDetails,
  publishKeySend,
} = require("../controllers/paymentController");

const {
  cratePlan,
  fetchPlanById,
  fetchAllPlan,
  updatePlanById,
  deletePlanById,
} = require("../controllers/planController");

const {
  sendConnRequest,
  updateConnRequestById,
  deleteConnRequestById,
  getConnRequests,
  acceptConnRequest,
  getSendedConnRequests,
  getPartners,
  removePartner,
} = require("../controllers/connectionRequestController");

// -------------------- User Profile Route ----------------------------------------------------------------------------------

router.post("/customer/register", addUser);
router.get("/assets/image/:fileName", getImage);
router.post("/customer/login", login);
router.get("/customer/logout", logOut);
router.post("/customer/forgotpass", forgetPass);
router.post("/customer/resetpass", fpUpdatePass);
router.put("/customer/update", validateTokenMiddleware, updateUser);
router.patch(
  "/customer/updatePassword",
  validateTokenMiddleware,
  updatePassword
);
router.get("/customer/getUserById", validateTokenMiddleware, getUserById);
router.get(
  "/customer/getAllUsers",
  validateTokenMiddleware,
  getAllUsersByQuery
);

// --------------------- Chat Routes ----------------------------------------------------------------------------------------------

router.post("/chat", validateTokenMiddleware, accessChat);
router.get("/chat", validateTokenMiddleware, fetchChats);

// --------------------- Message Routes -------------------------------------------------------------------------------------------

router.post("/message", validateTokenMiddleware, sendMessage);
router.get("/message/:chatId", validateTokenMiddleware, allMessages);

// --------------------- Search Routes -------------------------------------------------------------------------------------------

router.post("/create-search", createSearch);
router.get("/fetchAll-search", validateTokenMiddleware, fetchAllSearch);
router.get(
  "/fetch-search-bySearchId/:searchId",
  validateTokenMiddleware,
  fetchSearchBySearchId
);
router.put("/update-search/:searchId", validateTokenMiddleware, updateSearch);
router.delete(
  "/delete-search/:searchId",
  validateTokenMiddleware,
  deleteSearch
);

// --------------------- Stripe Payment Routes -----------------------------------------------------------------------------------

router.post(
  "/create-stripe-payment",
  validateTokenMiddleware,
  createStripePayment
);

router.get(
  "/fetch-stripe-payment/:paymentId",
  validateTokenMiddleware,
  fetchPaymentDetails
);

router.get("/config", publishKeySend);

// router.put(
//   "/payment-status/:paymentId",
//   validateTokenMiddleware,
//   paymentStatus
// );

// ********** Plan Routes ****************************

router.post("/create-plan", validateTokenMiddleware, cratePlan);

router.get("/fetch-plan/:planId", validateTokenMiddleware, fetchPlanById);

router.get("/fetchAllPlan", validateTokenMiddleware, fetchAllPlan);

router.put("/update-plan/:planId", validateTokenMiddleware, updatePlanById);

router.delete("/delete-plan/:planId", validateTokenMiddleware, deletePlanById);

// ********** Connection-Request-Route *******************

router.post("/create-conn-request", validateTokenMiddleware, sendConnRequest);

router.post(
  "/accept-conn-request/:senderProfileId",
  validateTokenMiddleware,
  acceptConnRequest
);

router.get("/fetch-All-conn-request", validateTokenMiddleware, getConnRequests);

router.get(
  "/getAll-sender-conn-request",
  validateTokenMiddleware,
  getSendedConnRequests
);

router.get("/getAll-partners", validateTokenMiddleware, getPartners);

router.put(
  "/update-conn-request/:connRequestId",
  validateTokenMiddleware,
  updateConnRequestById
);

router.delete(
  "/delete-conn-request/:withUserId",
  validateTokenMiddleware,
  deleteConnRequestById
);

router.delete(
  "/remove-partner/:partnershipId",
  validateTokenMiddleware,
  removePartner
);

module.exports = router;
