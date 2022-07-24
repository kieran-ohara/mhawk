import debug from "debug";
import crypto from "crypto";
import { getSession } from "next-auth/client";
import { addPaymentPlanPayment } from "../../../../../lib/payment-plans";

const log = debug("mhawk-post-payments");

const postController = async function postController(req, res) {
  try {
    const body = {
      date: req.body.date,
      dedupe_id: crypto.randomUUID(),
      amount: -req.body.amount,
    };
    await addPaymentPlanPayment(req.query.id, body);
    return res.status(201).end();
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
    case "POST":
      return postController(req, res);
    default:
      return res.status(400).end();
  }
}
