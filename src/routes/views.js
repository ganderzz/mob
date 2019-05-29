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
      title: "Active Polls",
      subtitle: "Polls in progress.",
      isAdmin: req.cookies.auth,
      polls: polls
    });
  });

  app.get("/polls/:pollId", async (req, res) => {
    let polls = [await new PollsRepository().getPollById(req.params.pollId)];

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
      shouldHideFooter: true,
      shouldHideHero: true,
      polls: polls
    });
  });

  app.get("/admin", function(req, res) {
    res.render("admin.njk", {
      title: "Admin",
      subtitle: "Administrative functionality for MOB.",
      isAdmin: req.cookies.auth
    });
  });

  app.get("/login", function(req, res) {
    res.render("login.njk", { isAdmin: req.cookies.auth });
  });
};
