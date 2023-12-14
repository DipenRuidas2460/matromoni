const Search = require("../models/search");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const createSearch = asyncHandler(async (req, res) => {
  try {
    const reqBody = req.body;
    const searchDetails = await Search.create(reqBody);
    const response = await searchDetails.save();

    return res.status(201).json({
      status: "success",
      response,
      message: "Search Details successfully created!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fetchSearchBySearchId = asyncHandler(async (req, res) => {
  try {
    const searchId = req.params.searchId;
    const searchData = await Search.findOne({ where: { id: searchId } });

    return res.status(200).json({
      status: "success",
      searchData,
      message: "Search Data fetch successfully!",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const fetchAllSearch = asyncHandler(async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.person.id },
      attributes: ["id", "role"],
    });

    if (userData.role === "admin") {
      const searchData = await Search.find({});
      return res.status(200).json({
        status: "success",
        searchData,
        message: "All Search Data fetch successfully!",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
});

const updateSearch = async function (req, res) {
  try {
    const searchId = req.params.searchId;
    const userData = await User.findOne({
      where: { id: req.person.id },
      attributes: ["id", "role"],
    });

    if (userData.role === "user" && userData.role === "admin") {
      const updateSearchData = await Search.update(req.body, {
        where: { id: searchId },
      });
      return res.status(200).json({
        status: "success",
        message: "Search Data Updated Successfully!",
        updateSearchData,
      });
    }

    return res.status(401).json({
      status: false,
      msg: "Not Authorized to Update!",
    });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).send(err.message);
  }
};

const deleteSearch = async function (req, res) {
  try {
    const searchId = req.params.searchId;
    const userData = await User.findOne({
      where: { id: req.person.id },
      attributes: ["id", "role"],
    });

    if (userData.role === "user" && userData.role === "admin") {
      const deletedData = await Search.destroy({
        where: { id: searchId },
      });

      if (!deletedData) {
        return res
          .status(404)
          .send({ status: false, msg: "Search Data already deleted!" });
      }
      return res.status(200).json({
        status: "success",
        message: "Search Data deleted Successfully!",
      });
    }

    return res.status(400).json({
      status: false,
      msg: "Not Authorized to delete Data!",
    });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).send(err.message);
  }
};

module.exports = {
  createSearch,
  fetchAllSearch,
  fetchSearchBySearchId,
  updateSearch,
  deleteSearch,
};
