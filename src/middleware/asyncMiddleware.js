const asyncMiddleware = fn => (req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  Promise.resolve(fn(req, res, next)).catch(function(error) {
    res.status(error.status || 500);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ message: error.message }));

    next();
  });
};

module.exports = asyncMiddleware;
