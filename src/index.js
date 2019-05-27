const express = require("express");
const nunjucks = require("nunjucks");
const API = require("./api");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const { BASE_URL } = require("./utils/path");

const app = express();

app.use(helmet());

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use("/public", express.static(path.resolve(BASE_URL, "views", "public")));

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

  console.log("listening on localhost:3000");
});
