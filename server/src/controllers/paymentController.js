const Payment = require("../models/payment");
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const moment = require("moment");
const Plan = require("../models/plan");

// const [basic, premium] = [
//   "price_1OaBwdSCtwAeEksSdZpb0Ez1",
//   "price_1OaBztSCtwAeEksSz3HFcKAQ",
// ];

// ***** Create stripe Session *******

// const stripeSession = async (plan) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: plan,
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.FRN_HOST}/success`,
//       cancel_url: `${process.env.FRN_HOST}/cancel`,
//     });
//     return session;
//   } catch (e) {
//     return e;
//   }
// };

// ***** Create stripe payment and store into database *******

const createStripePayment = async (req, res) => {
  try {
    const { planId } = req.body;

    const planData = await Plan.findOne({ where: { id: planId } });

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: planData.amount * 100,
      automatic_payment_methods: { enabled: true },
    });

    const data = {
      userId: req.person.id,
      subscription: {
        clientSecret: paymentIntent.client_secret,
        planId: planData.id,
        planName: planData.planName,
      },
      plan: planData.amount,
    };

    const paymentData = await Payment.create(data);

    // const session = await stripeSession(planId);
    // const data = {
    //   userId: req.person.id,
    //   subscription: {
    //     sessionId: session.id,
    //   },
    //   plan: plan,
    // };

    return res.status(200).send({
      status: true,
      msg: "Payment data created Successfully!",
      clientSecret: paymentIntent.client_secret,
      paymentData: paymentData,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
};

const publishKeySend = (req, res) => {
  return res.status(200).send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

// ***** Check Payment Status Success and Failed!! *******

// const paymentStatus = async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     const paymentId = req.params.paymentId;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     if (session.payment_status === "paid") {
//       const subscriptionId = session.subscription;
//       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
//       const planId = subscription.plan.id;
//       const planType = subscription.plan.amount === 12900 ? "basic" : "premium";
//       const startDate = moment
//         .unix(subscription.current_period_start)
//         .format("DD-MM-YYYY");
//       const endDate = moment
//         .unix(subscription.current_period_end)
//         .format("DD-MM-YYYY");
//       const durationInSeconds =
//         subscription.current_period_end - subscription.current_period_start;
//       const durationInDays = moment
//         .duration(durationInSeconds, "seconds")
//         .asDays();

//       const updatedData = {
//         subscription: {
//           sessionId: null,
//           planId: planId,
//           planType: planType,
//           planStartDate: startDate,
//           planEndDate: endDate,
//           planDuration: durationInDays,
//         },
//       };

//       await Payment.update(updatedData, {
//         where: { id: paymentId },
//       });

//       const response = await Payment.findOne({ where: { id: paymentId } });

//       response.paymentStatus = "success";
//       const result = await response.save();

//       return res.status(200).json({
//         status: true,
//         data: result,
//         message: "Payment Success!",
//       });
//     } else {
//       const response = await Payment.findOne({ where: { id: paymentId } });
//       response.paymentStatus = "failed";
//       const result = await response.save();
//       return res
//         .status(200)
//         .send({ status: false, msg: "Payment failed!", data: result });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(error.status || 500).send(error.message);
//   }
// };

const fetchPaymentDetails = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const paymentData = await Payment.findOne({
      where: { id: paymentId },
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

module.exports = {
  createStripePayment,
  // paymentStatus,
  fetchPaymentDetails,
  publishKeySend,
};
