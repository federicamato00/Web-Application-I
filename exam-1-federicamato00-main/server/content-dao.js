'use strict';

const { Page, Content } = require('./Page');
const db=require('./db');

function getContentById(id){
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * from content WHERE pageID=? ORDER BY ordered';
        db.all(sql,[id],(err,rows)=>{
            if(err) reject(err);
            else {
                
                const contents= rows.map(row=> new Content(row.id,row.type,row.content,row.user));
                
                resolve(contents);
            }
        });
    });

}
function getContent(){
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * from content ORDER By ordered';
        db.all(sql,(err,rows)=>{
            if(err) reject(err);
            else {
                const contents= rows.map(row=> new Content(row.id,row.type,row.content,row.user));
                resolve(contents);
            }
        });
    });

}
function editContent(content,index){


const updateQuery = `
  UPDATE content
  SET type = ?, content = ?, ordered = ?, user=?
  WHERE id = ? AND pageID=?
`;

const insertQuery = `
  INSERT INTO content (pageID, type, content, user, ordered)
  VALUES (?,?,?,?,?)
`;

function runQuery(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

runQuery(updateQuery, [content.type,content.content,content.ordered,content.user,index,content.pageID])
  .then(updateResult => {
    if (updateResult.changes > 0) {
      console.log('Dati aggiornati con successo.');
      return Promise.resolve();
    } else {
      return runQuery(insertQuery, [content.pageID,content.type,content.content,content.user,content.ordered]);
    }
  })
  .then(insertResult => {
    if (insertResult) {
      console.log('Nuovi dati inseriti con successo.');
    }
  })
  .catch(error => {
    console.error('Errore durante l\'esecuzione della query:', error);
  });

}
function addContent(content) {
    return new Promise((resolve,reject)=>{
        const sql='INSERT INTO content(pageID,type,content,user,ordered) VALUES(?,?,?,?,?)';
        db.run(sql,[content.id,content.type,content.content,content.author,content.order], (err)=>{
            if(err) reject(err.message);
            else resolve(true);
        });
    });
}
function deleteContent ( id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM content WHERE pageID=?';
      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        }
          resolve(null);
      });
    });
  }
  function deleteContentById (id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM content WHERE id=?';
      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        }
          resolve(null);
      });
    });
  }
exports.getContentById=getContentById;
exports.getContent=getContent;
exports.addContent=addContent;
exports.deleteContent=deleteContent;
exports.editContent=editContent;
exports.deleteContentById=deleteContentById;