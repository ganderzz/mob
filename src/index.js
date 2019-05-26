const express = require("express");
const nunjucks = require("nunjucks");
const API = require("./api");
const asyncMiddleware = require("./middleware/asyncMiddleware");

const app = express();
app.use(express.json());

const http = require("http").createServer(app);

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.get("/", function(req, res) {
  res.render("index.html");
});

app.get(
  "/active-poll",
  asyncMiddleware(async (req, res) => {
    const result = await new API().getActivePolls();

    res.send(result);
  })
);

app.post(
  "/create",
  asyncMiddleware(async (req, res) => {
    const result = await new API().createPoll(req.body);

    res.send(result);
  })
);

http.listen(3000, function() {
  const db = new API();
  db.init();
  db.close();

  console.log("listening on *:3000");
});
