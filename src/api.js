const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { BASE_URL } = require("./utils/path");

class API {
  constructor() {
    this.DB = new sqlite3.Database(path.resolve(BASE_URL, "db/polls.db"));
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
    const sql = "SELECT * FROM polls WHERE isActive = 1";

    return new Promise((resolve, reject) => {
      this.DB.all(sql, [], (error, rows) => {
        if (error) {
          return reject(error);
        }

        return resolve(rows);
      });
    });
  }

  /**
   * Create Poll using the provided questions and options
   *
   * @param {*} poll
   */
  createPoll(poll) {
    return new Promise((resolve, reject) => {
      if (!poll || !poll.question) {
        return reject("Poll is missing a question.");
      }

      if (!poll.options) {
        return reject("A poll must be created with options.");
      }

      const db = this.DB;

      db.run(
        `INSERT INTO polls 
    (question, isActive) 
    VALUES (?, 1)
  `,
        poll.question,
        function(err) {
          if (err) {
            return reject(err);
          }

          poll.options.forEach(val => {
            db.run(
              `INSERT INTO options 
          (pollId, value, totalVotes) 
          VALUES (?, ?, 0)`,
              [this.lastID, val]
            );
          });

          resolve();
        }
      );
    });
  }
}

module.exports = API;
