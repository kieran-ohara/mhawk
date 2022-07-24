import debug from "debug";
import { getSession } from "next-auth/client";
import {
  getPaymentPlansWithIds,
  updatePaymentPlan,
  deletePaymentPlan,
} from "../../../../lib/payment-plans";
import { getTagsForPaymentPlan } from "../../../../lib/tags";

const log = debug("mhawk-payment-plans");

const getController = async function postController(req, res) {
  try {
    const { id } = req.query;
    return Promise.all([
      getPaymentPlansWithIds([id]),
      getTagsForPaymentPlan(id),
    ])
      .then((data) => {
        const [paymentPlan, tags] = data;
        return res.status(200).json({
          ...paymentPlan[0],
          tags,
        });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

const patchController = async function postController(req, res) {
  try {
    await updatePaymentPlan(req.query.id, req.body);
    return res.status(204).end();
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

const deleteController = async function postController(req, res) {
  try {
    await deletePaymentPlan(req.query.id);
    return res.status(204).end();
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
    case "PATCH":
      return patchController(req, res);
    case "DELETE":
      return deleteController(req, res);
    default:
      return res.status(400).end();
  }
}
