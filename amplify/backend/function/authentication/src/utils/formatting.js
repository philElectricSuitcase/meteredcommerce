const getUTCDateTimeString = (value) => {
  if (value === undefined || value === null) return "";

  let datetime = new Date(value);

  let utcYear = datetime.getUTCFullYear();
  let utcMonth = datetime.getUTCMonth() + 1;
  let utcDay = datetime.getUTCDate();
  let utcHour = datetime.getUTCHours();
  let utcMinute = datetime.getUTCMinutes();
  let utcSecond = datetime.getUTCSeconds();

  return (
    utcYear.toString().padStart(4, "0") +
    "-" +
    utcMonth.toString().padStart(2, "0") +
    "-" +
    utcDay.toString().padStart(2, "0") +
    " " +
    utcHour.toString().padStart(2, "0") +
    ":" +
    utcMinute.toString().padStart(2, "0") +
    ":" +
    utcSecond.toString().padStart(2, "0")
  );
};

module.exports = {
  getUTCDateTimeString,
};
