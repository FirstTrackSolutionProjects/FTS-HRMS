const calculateLeaveDays = (startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error("Invalid date format. Use 'YYYY-MM-DD'.");
  }

//   if (endDate < startDate) {
//     throw new Error("End date must be after or equal to start date.");
//   }

  // Calculate time difference in milliseconds
  const timeDiff = endDate - startDate;

  // Convert milliseconds to days and add 1 to include both start and end dates
  const leaveDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  return leaveDays;
}

export default calculateLeaveDays;
