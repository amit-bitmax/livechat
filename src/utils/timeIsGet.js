const timeIsGet = () => {
  const istOffset = 5.5 * 60; // IST is UTC+5:30 in minutes
  const currentUTC = new Date();
  const istTime = new Date(currentUTC.getTime() + istOffset * 60 * 1000);
  return istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
};

export default timeIsGet;
