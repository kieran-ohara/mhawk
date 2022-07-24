import debug from "debug";
import { query } from "./mysql";

const log = debug("mhawk-users");

const getUserById = async (id) => {
  const result = await query("SELECT * FROM users WHERE id = ?", [id]);
  return result[0];
};

const getTaxedWage = async (id) => {
  const user = await getUserById(id);
  log(user.monthly_wage_net);
  return user.monthly_wage_net;
};

const getPayDay = async (id) => {
  const user = await getUserById(id);
  log(user.payday_day);
  return user.payday_day;
};

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / msPerDay);
}

const daysUntilPayDay = async (id) => {
  const now = new Date();
  const nextPayDay = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    await getPayDay(id)
  );
  return dateDiffInDays(now, nextPayDay);
};

export { getTaxedWage, daysUntilPayDay };
