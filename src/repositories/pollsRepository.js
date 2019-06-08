const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { BASE_URL } = require("../utils/path");
const { runAsync } = require("../utils/db");

class PollsRepository {
  constructor() {
    this.DB = new sqlite3.Database(path.resolve(BASE_URL, "db", "polls.db"));
  }

  close() {
    if (this.DB) {
      this.DB.close();
    }
  }

  async init() {
    if (!this.DB) {
      throw new Error("Database is not initialized");
    }

    // ----- Tables -----

    await runAsync(
      this.DB,
      `CREATE TABLE IF NOT EXISTS polls (
        id INTEGER PRIMARY KEY, 
        question TEXT, 
        isActive INTEGER
      )`
    );

    await runAsync(
      this.DB,
      `CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY, 
        pollId INTEGER, 
        value TEXT, 
        totalVotes INTEGER, 
        FOREIGN KEY(pollId) REFERENCES polls(id)
      )`
    );

    // ----- Indicies -----

    await runAsync(
      this.DB,
      `CREATE INDEX IF NOT EXISTS idx_pollid ON options(pollId)`
    );
  }

  getActivePolls() {
    const sql = `
      SELECT * FROM polls p
      LEFT JOIN options as o ON o.pollId = p.id 
      WHERE p.isActive = 1
    `;

    return new Promise(resolve => {
      this.DB.all(sql, [], (error, rows) => {
        if (error) {
          return new Error(error);
        }

        const groupedByPoll = PollsRepository.groupRows(rows);

        return resolve(
          Object.keys(groupedByPoll).map(key => groupedByPoll[key])
        );
      });
    });
  }

  getClosedPolls() {
    const sql = `
      SELECT * FROM polls p
      LEFT JOIN options as o ON o.pollId = p.id 
      WHERE p.isActive = 0
    `;

    return new Promise(resolve => {
      this.DB.all(sql, [], (error, rows) => {
        if (error) {
          return new Error(error);
        }

        const groupedByPoll = PollsRepository.groupRows(rows);

        return resolve(
          Object.keys(groupedByPoll).map(key => groupedByPoll[key])
        );
      });
    });
  }

  openPoll(pollId) {
    if (pollId == null) {
      return Promise.reject("Invalid Poll ID.");
    }

    return new Promise(resolve => {
      this.DB.run(
        `UPDATE polls SET isActive = 1 WHERE id = ?`,
        [pollId],
        function() {
          resolve(true);
        }
      );
    });
  }

 closePoll(pollId) {
    if (pollId == null) {
      return Promise.reject("Invalid Poll ID.");
    }

    return new Promise(resolve => {
      this.DB.run(
        `UPDATE polls SET isActive = 0 WHERE id = ?`,
        [pollId],
        function() {
          resolve(true);
        }
      );
    });
  }

  updateOptionCount(optionId) {
    if (optionId == null || optionId == undefined) {
      return Promise.reject("Invalid option id provided.");
    }

    return new Promise(resolve => {
      this.DB.run(
        `
        UPDATE options
        SET totalVotes = totalVotes + 1
        WHERE id = ?
      `,
        [optionId],
        function() {
          resolve();
        }
      );
    });
  }

  getPollById(id) {
    if (id == null || id == undefined) {
      return Promise.reject("Invalid ID provided.");
    }

    const sql = `
      SELECT * FROM polls as p 
      LEFT JOIN options as o ON o.pollId = p.id
      WHERE p.id = ? 
    `;

    return new Promise(resolve => {
      this.DB.all(sql, [id], (error, rows) => {
        if (error) {
          throw new Error(error);
        }

        const groupedByPoll = PollsRepository.groupRows(rows);

        return resolve(
          Object.keys(groupedByPoll).map(key => groupedByPoll[key])[0]
        );
      });
    });
  }

  /**
   * Create Poll using the provided questions and options
   *
   * @param {*} poll
   */
  createPoll(poll) {
    return new Promise(resolve => {
      if (!poll || !poll.question) {
        throw new Error("Poll is missing a question.");
      }

      if (!poll.options || poll.options.length < 1) {
        throw new Error("A poll must be created with options.");
      }

      const db = this.DB;

      db.run(
        `INSERT INTO polls 
          (question, isActive) 
          VALUES (?, 1)
        `,
        [poll.question],
        function(err) {
          if (err) {
            throw new Error(err);
          }

          const pollId = this.lastID;

          poll.options.forEach(val => {
            db.run(
              `INSERT INTO options 
              (pollId, value, totalVotes) 
              VALUES (?, ?, 0)
              `,
              [pollId, val]
            );
          });

          resolve(pollId);
        }
      );
    });
  }

  static groupRows(rows) {
    if (!rows) {
      return [];
    }

    return rows.reduce((accu, current) => {
      return {
        ...accu,
        [current.pollId]: {
          ...(accu[current.pollId] || {}),
          id: current.pollId,
          question: current.question,
          isActive: current.isActive || 0,
          options: [
            ...(accu[current.pollId] ? accu[current.pollId].options : []),
            {
              id: current.id,
              value: current.value,
              totalVotes: current.totalVotes
            }
          ]
        }
      };
    }, {});
  }
}

module.exports = PollsRepository;
