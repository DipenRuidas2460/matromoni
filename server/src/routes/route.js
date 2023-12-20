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
router.get("/customer/getAllUsers", validateTokenMiddleware, getAllUsersByQuery);

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

module.exports = router;
