const getCurrentUTCTime = () => {
  const now = new Date();
  return now.toISOString().split('T')[1].split('.')[0]; // Extract HH:MM:SS
};

export default getCurrentUTCTime;