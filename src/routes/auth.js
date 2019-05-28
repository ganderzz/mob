const asyncMiddleware = require("../middleware/asyncMiddleware");

module.exports = function(app) {
  app.post(
    "/api/login",
    asyncMiddleware(async (req, res) => {
      if (!req.body) {
        throw new Error("Invalid password given.");
      }

      if (res.cookies && res.cookies.auth) {
        throw new Error("Already logged in");
      }

      const pass = req.body.value;

      if (pass === (process.env.MOB_LOGIN_PASSWORD || "MOB")) {
        res.cookie("auth", true, { maxAge: 24 * 60 * 60 * 60 });
      } else {
        throw new Error("Invalid password given.");
      }

      res.send(JSON.stringify(true));
    })
  );
};
