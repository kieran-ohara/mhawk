import debug from "debug";
import { getSession } from "next-auth/client";
import {
  getChartDataForMonthsAggregateEndDate,
  getChartDataForMonths,
} from "../../../lib/chart";

const log = debug("mhawk-payment-chart");

const getController = async function getController(req, res) {
  const { start_date: startDate, end_date: endDate } = req.query;
  try {
    const strategy =
      req.query.aggregate_payment_type === "false"
        ? getChartDataForMonths
        : getChartDataForMonthsAggregateEndDate;
    const content = await strategy(new Date(startDate), new Date(endDate));
    return res.status(200).json(content);
  } catch (error) {
    log(error);
    return res.status(500).json({ error });
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
    default:
      return res.status(400).end();
  }
}
