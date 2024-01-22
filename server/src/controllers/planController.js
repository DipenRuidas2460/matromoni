const Plan = require("../models/plan");

const cratePlan = async (req, res) => {
  try {
    const createPlanData = await Plan.create(req.body);
    return res.status(200).send({
      status: true,
      msg: "Plan data created Successfully!",
      planData: createPlanData,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

const fetchAllPlan = async (req, res) => {
  try {
    const findPlanData = await Plan.findAll({});
    if (findPlanData.length === 0) {
      return res.status(404).send({
        status: false,
        msg: "Plan data not found!",
      });
    }
    return res.status(200).send({
      status: true,
      msg: "All Plan data find Successfully!",
      planData: findPlanData,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

const fetchPlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const findPlanData = await Plan.findOne({ where: { id: planId } });
    if (!findPlanData) {
      return res.status(404).send({
        status: false,
        msg: "Plan data not found!",
      });
    }
    return res.status(200).send({
      status: true,
      msg: "Plan data find Successfully!",
      planData: findPlanData,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

const updatePlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const response = await Plan.update(req.body, {
      where: { id: planId },
    });
    return res.status(200).json({
      status: response[0] === 0 ? 404 : 200,
      data: response,
      message:
        response[0] === 0 ? "Nothing updated" : "Successfully Updated Plan!",
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

const deletePlanById = async (req, res) => {
  try {
    const planId = req.params.planId;
    const response = await Plan.destroy({
      where: { id: planId },
    });

    if (!response) {
      return res
        .status(404)
        .send({ status: false, msg: "Plan Data not found!" });
    }

    return res.status(200).json({
      status: true,
      message: "Plan Data deleted Successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

module.exports = {
  cratePlan,
  fetchAllPlan,
  fetchPlanById,
  updatePlanById,
  deletePlanById,
};
