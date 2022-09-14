export default (resCode, data, res) => {
  res.status(resCode).json({ ...data });
};
