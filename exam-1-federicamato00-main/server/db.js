'use strict';

/** DB access module **/

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('database.sqlite', (err) => {
  if (err) throw err;
});

module.exports = db;
