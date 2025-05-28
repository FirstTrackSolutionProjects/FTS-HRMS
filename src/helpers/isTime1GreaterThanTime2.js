const isTime1GreaterThanTime2 = (time1, time2) => {
  const toSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return toSeconds(time1) > toSeconds(time2);
}

export default isTime1GreaterThanTime2;