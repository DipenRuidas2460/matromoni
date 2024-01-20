const Payment = require("../models/payment");
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const [basic, premium] = [
  "price_1OaBwdSCtwAeEksSdZpb0Ez1",
  "price_1OaBztSCtwAeEksSz3HFcKAQ",
];

// ***** Create stripe Session *******

const stripeSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRN_HOST}/success`,
      cancel_url: `${process.env.FRN_HOST}/cancel`,
    });
    return session;
  } catch (e) {
    return e;
  }
};

// ***** Create stripe payment and store into database *******

const createStripePayment = async (req, res) => {
  try {
    const { plan } = req.body;
    let planId = null;
    if (plan == 129) planId = basic;
    else if (plan == 399) planId = premium;
    const session = await stripeSession(planId);
    const data = {
      userId: req.person.id,
      subscription: {
        sessionId: session.id,
      },
      plan: plan,
    };

    const paymentData = await Payment.create(data);

    return res.status(200).send({
      status: true,
      msg: "Payment data created Successfully!",
      session: session,
      paymentData: paymentData,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

// ***** Check Payment Status Success and Failed!! *******

const paymentStatus = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("session:--", session);
    if (session.payment_status === "paid") {
      const subscriptionId = session.subscription;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const planId = subscription.plan.id;
      const planType = subscription.plan.amount === 12900 ? "basic" : "premium";
      const startDate = moment
        .unix(subscription.current_period_start)
        .format("DD-MM-YYYY");
      const endDate = moment
        .unix(subscription.current_period_end)
        .format("DD-MM-YYYY");
      const durationInSeconds =
        subscription.current_period_end - subscription.current_period_start;
      const durationInDays = moment
        .duration(durationInSeconds, "seconds")
        .asDays();

      const updatedData = {
        subscription: {
          sessionId: null,
          planId: planId,
          planType: planType,
          planStartDate: startDate,
          planEndDate: endDate,
          planDuration: durationInDays,
        },
      };

      await Payment.update(updatedData, {
        where: { userId: userId },
      });

      const response = await Payment.findOne({ where: { userId: userId } });

      response.paymentStatus = "success";
      const result = await response.save();

      return res.status(200).json({
        status: true,
        data: result,
        message: "Payment Success!",
      });
    } else {
      const response = await Payment.findOne({ where: { userId: userId } });
      response.paymentStatus = "failed";
      const result = await response.save();
      return res
        .status(200)
        .send({ status: false, msg: "Payment failed!", data: result });
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

const fetchPaymentDetails = async (req, res) => {
  try {
    const paymentData = await Payment.findOne({
      where: { userId: req.person.id },
    });
    if (!paymentData) {
      return res
        .status(404)
        .send({ status: false, msg: "Payment Info not found!!" });
    }
    return res.status(200).send({
      status: true,
      msg: "Payment Info found successfully!!",
      paymentData: paymentData,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

module.exports = { createStripePayment, paymentStatus, fetchPaymentDetails };
