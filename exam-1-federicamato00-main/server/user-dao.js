'use strict';

const { User } = require('./Page');
const db=require('./db');
const crypto=require('crypto');

function getUserById (id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE ID=?';
      db.get(sql, [id], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({ error: 'User not found.' });
        else {
          // By default, the local strategy looks for "username": 
          // for simplicity, instead of using "email", we create an object with that property.
          const user = { id: row.ID, username: row.EMAIL, name: row.NAME }
          resolve(user);
        }
      });
    });
  };
  

  function getUser(email, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE EMAIL=?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        }
        else {
          const user = { id: row.ID, username: row.EMAIL, name: row.NAME, admin: row.admin };
          
          // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
          crypto.scrypt(password, row.SALT, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
            if (err) reject(err);
            if (!crypto.timingSafeEqual(Buffer.from(row.PASSWORD, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
              resolve(false);
            else
              resolve(user);
          });
        }
      });
    });
  };

  function getUsers(){
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users ';
      db.all(sql, (err, rows) => {
        if (err)
          reject(err);
        
        else {
          const user = rows.map(u=>new User(u.NAME,u.admin));
          resolve(user);
        }
      });
    });
  }
  exports.getUser=getUser;
  exports.getUsers=getUsers;
  exports.getUserById=getUserById;