const express = require("express");
const nunjucks = require("nunjucks");
const API = require("./api");
const compression = require("compression");

const app = express();
app.use(compression());
app.use(express.json());

const http = require("http").createServer(app);

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

require("./routes/polls")(app);

http.listen(3000, function() {
  const db = new API();
  db.init();
  db.close();

  console.log("listening on *:3000");
});
