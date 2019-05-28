const asyncMiddleware = require("../middleware/asyncMiddleware");
const PollsRepository = require("../repositories/pollsRepository");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index.njk", { isAdmin: req.cookies.auth });
  });

  app.get("/polls/:pollId", async (req, res) => {
    const poll = await new PollsRepository().getPollById(req.params.pollId);

    res.render("index.njk", {
      isAdmin: req.cookies.auth,
      poll: JSON.stringify(poll)
    });
  });

  app.get("/admin", function(req, res) {
    res.render("admin.njk", { isAdmin: req.cookies.auth });
  });

  app.get("/login", function(req, res) {
    res.render("login.njk", { isAdmin: req.cookies.auth });
  });
};
