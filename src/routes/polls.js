const asyncMiddleware = require("../middleware/asyncMiddleware");
const PollsRepository = require("../repositories/pollsRepository");

module.exports = function(app) {
  app.get(
    "/api/polls",
    asyncMiddleware(async (req, res) => {
      const result = await new PollsRepository().getActivePolls();

      res.send(JSON.stringify(result));
    })
  );

  app.get(
    "/api/polls/:id",
    asyncMiddleware(async (req, res) => {
      if (!req.params || !req.params.id) {
        throw new Error("Invalid id provided.");
      }

      const result = await new PollsRepository().getPollById(req.params.id);

      res.send(JSON.stringify(result));
    })
  );

  app.post(
    "/api/polls",
    asyncMiddleware(async (req, res) => {
      const result = await new PollsRepository().createPoll(req.body);

      res.send(JSON.stringify(result));
    })
  );

  app.put(
    "/api/polls/:pollId/close",
    asyncMiddleware(async (req, res) => {
      const result = await new PollsRepository().closePoll(req.params.pollId);

      res.send(JSON.stringify(result));
    })
  );

  app.put(
    "/api/polls/:pollId/open",
    asyncMiddleware(async (req, res) => {
      const result = await new PollsRepository().openPoll(req.params.pollId);

      res.send(JSON.stringify(result));
    })
  );

  app.put(
    "/api/polls/:pollId/options/:optionId",
    asyncMiddleware(async (req, res) => {
      const optionId = req.params.optionId;
      const pollId = req.params.pollId;

      await new PollsRepository().updateOptionCount(optionId);

      res.cookie(pollId.toString(), optionId.toString(), {
        maxAge: 99999999999
      });

      res.send(JSON.stringify(true));
    })
  );
};
