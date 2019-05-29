const asyncMiddleware = require("../middleware/asyncMiddleware");
const PollsRepository = require("../repositories/pollsRepository");

module.exports = function(app) {
  app.get("/", async (req, res) => {
    let polls = await new PollsRepository().getActivePolls();

    if (polls) {
      polls = polls.map(p => {
        return {
          ...p,
          totalVotes: p.options.reduce(
            (accu, current) => accu + current.totalVotes,
            0
          ),
          votedOption: req.cookies[p.id]
        };
      });
    }

    res.render("index.njk", {
      isAdmin: req.cookies.auth,
      polls: polls
    });
  });

  app.get("/polls/:pollId", async (req, res) => {
    const poll = await new PollsRepository().getPollById(req.params.pollId);

    res.render("index.njk", {
      isAdmin: req.cookies.auth,
      shouldHideFooter: true,
      shouldHideHero: true,
      polls: [poll]
    });
  });

  app.get("/admin", function(req, res) {
    res.render("admin.njk", { isAdmin: req.cookies.auth });
  });

  app.get("/login", function(req, res) {
    res.render("login.njk", { isAdmin: req.cookies.auth });
  });
};
