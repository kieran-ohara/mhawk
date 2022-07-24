import debug from "debug";
import { getSession } from "next-auth/client";
import {
  addPaymentPlans,
  getAllPaymentPlans,
  getFinitePaymentPlans,
  getPaymentPlansActiveForPointInTime,
  getPaymentPlansWithTag,
  getRecurringPaymentPlans,
  searchPaymentPlansByReference,
} from "../../../lib/payment-plans";

const log = debug("mhawk-payment-plans");

const getController = async function getController(req, res) {
  let content = {};
  try {
    if (req.query.tag) {
      content = await getPaymentPlansWithTag(req.query.tag);
    } else if (req.query.payments_for_date) {
      const date = new Date(req.query.payments_for_date);
      content = await getPaymentPlansActiveForPointInTime(date);
    } else if (req.query.search) {
      content = await searchPaymentPlansByReference(req.query.search);
    } else if (req.query.has_end_date === "true") {
      content = await getFinitePaymentPlans();
    } else if (req.query.has_end_date === "false") {
      content = await getRecurringPaymentPlans();
    } else {
      content = getAllPaymentPlans();
    }
  } catch (error) {
    log(error);
    return res.status(500).json({ error });
  }
  return res.status(200).json(content);
};

const postController = async function postController(req, res) {
  try {
    if (req.body.length === 0) {
      return res.status(400).end();
    }
    const content = await addPaymentPlans(req.body);
    return res.status(200).json(content);
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

export default async function handler(req, res) {
  const { method } = req;

  const session = await getSession({ req });
  const hasSession = !!session;
  if (!hasSession) {
    return res.status(401).end();
  }

  switch (method) {
    case "GET":
      return getController(req, res);
    case "POST":
      return postController(req, res);
    default:
      return res.status(400).end();
  }
}
