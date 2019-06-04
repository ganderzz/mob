module.exports = {
  runAsync: function(db, query, params = []) {
    return new Promise((resolve, reject) => {
      db.run(query, params, function(result, err) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }
};
