import debug from "debug";
import Transaction from "../../../lib/monzo-transaction";
import { addPaymentPlanPayment } from "../../../lib/payment-plans";

const log = debug("mhawk-monzo-webhook");

const postController = async function postController(req, res) {
  try {
    const transaction = new Transaction(req.body);

    if (transaction.declined) {
      log("transaction declined: ignore post.");
      res.status(204).end();
      return;
    }

    const result = await addPaymentPlanPayment(transaction.reference, {
      date: transaction.created,
      dedupe_id: transaction.dedupeId,
      amount: transaction.amount,
    });

    if (result === null) {
      log(`reference "${transaction.reference}" not found in payment plan`);
    } else if (result === 0) {
      log("duplicated payment_plan_payment not inserted.");
    } else {
      log(`payment_plan_payment inserted with id ${result}.`);
    }

    res.status(204).end();
  } catch (error) {
    log(`error: ${error}`);
    res.status(500).json({ error });
  }
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      postController(req, res);
      break;
    default:
      res.status(400);
      break;
  }
}
