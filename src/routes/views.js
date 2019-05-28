module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index.njk", { isAdmin: req.cookies.auth });
  });

  app.get("/admin", function(req, res) {
    res.render("admin.njk", { isAdmin: req.cookies.auth });
  });

  app.get("/login", function(req, res) {
    res.render("login.njk", { isAdmin: req.cookies.auth });
  });
};
