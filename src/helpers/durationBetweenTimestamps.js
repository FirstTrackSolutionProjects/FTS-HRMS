// TESTED

const durationBetweenTimestamps = (start, end) => {
  const diffMs = Math.abs(new Date(end) - new Date(start));
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default durationBetweenTimestamps;