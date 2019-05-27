const asyncMiddleware = require("../middleware/asyncMiddleware");
const API = require("../api");

module.exports = function(app) {
  // ---- Views ----

  app.get("/", function(req, res) {
    res.render("index.html");
  });

  app.get("/admin", function(req, res) {
    res.render("admin.html");
  });

  // ---- API ----

  app.get(
    "/api/polls",
    asyncMiddleware(async (req, res) => {
      const result = await new API().getActivePolls();

      res.send(result);
    })
  );

  app.get(
    "/api/polls/:id",
    asyncMiddleware(async (req, res) => {
      if (!req.params || !req.params.id) {
        throw new Error("Invalid id provided.");
      }

      const result = await new API().getPollById(req.params.id);

      res.send(result);
    })
  );

  app.post(
    "/api/polls",
    asyncMiddleware(async (req, res) => {
      const result = await new API().createPoll(req.body);

      res.send(result);
    })
  );

  app.put(
    "/api/options/:optionId",
    asyncMiddleware(async (req, res) => {
      const result = await new API().updateOptionCount(req.params.optionId);

      res.send(result);
    })
  );
};
