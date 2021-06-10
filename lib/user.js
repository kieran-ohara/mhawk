const getTaxedWage = async () => 3719.47;
const getPayDay = async () => 15;

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / msPerDay);
}

const daysUntilPayDay = async () => {
  const now = new Date();
  const nextPayDay = new Date(now.getFullYear(), now.getMonth() + 1, 15);
  return dateDiffInDays(now, nextPayDay);
};

export { getTaxedWage, getPayDay, daysUntilPayDay };
