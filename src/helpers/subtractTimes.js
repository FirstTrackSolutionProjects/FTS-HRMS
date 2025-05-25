const subtractTimes = (time1, time2) => {
  const toSeconds = (timeStr) => {
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  };

  const toHHMMSS = (totalSeconds) => {
    const sign = totalSeconds < 0 ? '-' : '';
    totalSeconds = Math.abs(totalSeconds);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${sign}${h}:${m}:${s}`;
  };

  const diff = toSeconds(time1) - toSeconds(time2);
  return toHHMMSS(diff);
};

export default subtractTimes;