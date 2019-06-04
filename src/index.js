const express = require("express");
var fs = require("fs");
const nunjucks = require("nunjucks");
const PollsRepository = require("./repositories/pollsRepository");
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
  autoescape: false,
  watch: process.env.NODE_ENV !== "production",
  express: app
});

require("./routes/polls")(app);
require("./routes/views")(app);
require("./routes/auth")(app);

http.listen(3000, async () => {
  const databaseDirectory = "./db";

  // Create DB directory if it doesn't exist
  if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory);
  }

  const repo = new PollsRepository();
  await repo.init();

  console.log("listening on localhost:3000");
});
