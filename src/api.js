const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const BASE_URL = path.resolve(__dirname, "../");

class API {
  constructor() {
    this.DB = new sqlite3.Database(path.resolve(BASE_URL, "db/polls.db"));
    this.init();
  }

  close() {
    if (this.DB) {
      this.DB.close();
    }
  }

  init() {
    if (!this.DB) {
      throw "Database is not initialized";
      return;
    }

    this.DB.run(
      `CREATE TABLE IF NOT EXISTS polls (
        id INTEGER PRIMARY KEY, 
        question TEXT, 
        isActive INTEGER
      )`
    );

    this.DB.run(
      `CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY, 
        pollId INTEGER, 
        value TEXT, 
        totalVotes INTEGER, 
        FOREIGN KEY(pollId) REFERENCES polls(id)
      )`
    );
  }

  getActivePolls() {
    const sql = "SELECT * FROM polls ORDER BY id";

    return new Promise((resolve, reject) => {
      this.DB.all(sql, [], (error, rows) => {
        if (error) {
          return reject(error);
        }

        return resolve(rows);
      });
    });
  }

  createPoll(poll) {
    if (!poll || !poll.question) {
      return Promise.reject("Poll is missing a question.");
    }

    if (!poll.options) {
      return Promise.reject("A poll must be created with options.");
    }

    const sql = this.DB.prepare(
      "INSERT INTO polls (question, isActive) VALUES (?, 1)"
    );

    sql.run(poll.question);

    sql.finalize();

    return Promise.resolve();
  }
}

module.exports = API;
