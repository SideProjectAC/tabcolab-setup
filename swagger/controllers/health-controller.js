exports.healthCheckHandler = (req, res) => {
  res.status(200).send("Healthy");
};
