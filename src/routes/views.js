const PollsRepository = require("../repositories/pollsRepository");
const { groupPolls } = require("../utils/polls");

module.exports = function(app) {
  /**
   * Render the default 'show all active' page
   * that most users would see.
   */
  app.get("/", async (req, res) => {
    const polls = groupPolls(
      await new PollsRepository().getActivePolls(),
      req.cookies
    );

    res.render("index.njk", {
      title: "Active Polls",
      subtitle: "Polls in progress.",
      isAdmin: req.cookies.auth,
      polls: polls
    });
  });

  /**
   * Render a single poll. This is mostly used
   * for sharing a poll with people.
   */
  app.get("/polls/:pollId", async (req, res) => {
    const polls = groupPolls(
      [await new PollsRepository().getPollById(req.params.pollId)],
      req.cookies
    );

    res.render("index.njk", {
      isAdmin: req.cookies.auth,
      shouldHideFooter: true,
      shouldHideHero: true,
      polls: polls
    });
  });

  /**
   * Render the default admin page
   * [Currently Empty]
   */
  app.get("/admin", function(req, res) {
    res.render("admin.njk", {
      title: "Admin",
      subtitle: "Administrate MOB.",
      isAdmin: req.cookies.auth
    });
  });

  /**
   * Render the create polls page in the admin
   * view.
   */
  app.get("/admin/polls/create", function(req, res) {
    res.render("admin-create.njk", {
      title: "Create Poll",
      subtitle: "Create a new poll.",
      isAdmin: req.cookies.auth
    });
  });

  /**
   * Render the currently active polls. Allows
   * for closing and other actions on a poll.
   */
  app.get("/admin/polls/active", async (req, res) => {
    const polls = groupPolls(
      await new PollsRepository().getActivePolls(),
      req.cookies
    );

    res.render("admin-active.njk", {
      title: "View Active Polls",
      subtitle: "Administrate polls currently running.",
      isAdmin: req.cookies.auth,
      polls: polls
    });
  });

  /**
   * Renders the closes polls.
   */
  app.get("/admin/polls/closed", async (req, res) => {
    const polls = groupPolls(
      await new PollsRepository().getClosedPolls(),
      req.cookies
    );

    res.render("admin-closed.njk", {
      title: "View Closed Polls",
      subtitle: "View polls which have been closed.",
      isAdmin: req.cookies.auth,
      polls: polls
    });
  });

  /**
   * Render the login screen to access admin functionality.
   */
  app.get("/login", function(req, res) {
    res.render("login.njk", { isAdmin: req.cookies.auth });
  });
};
