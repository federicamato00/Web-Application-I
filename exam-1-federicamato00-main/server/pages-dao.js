'use strict';

const { resolve } = require('path');
const { Page } = require('./Page');

const db=require('./db');
const dayjs=require('dayjs');
function getPageById(id){
    if(id!=0)
    {return new Promise((resolve,reject)=>{
        const sql = 'SELECT * from pages WHERE id=?';
        db.get(sql,[id],(err,row)=>{
            if(err) reject(err);
            else {
                const page= new Page(row.id,row.title,row.author, row.creation_date, row.publication_date,row.admin);
                resolve(page);
            }
        });
    });}
    else {
        return new Promise((resolve,reject)=>{
            const sql='SELECT * FROM pages ORDER BY id DESC LIMIT 1';
            db.get(sql,(err,row)=>{
                if(err) reject(err);
                else{
                    resolve(new Page(row.id,row.title,row.author,row.creation_date,row.publication_date,row.admin));
                }
            })
        })
    }

}
function editPage(numPage,page){
    return new Promise((resolve,reject)=>{
        const sql='UPDATE pages SET title=?, author=?, creation_date=?, publication_date=?, admin=? WHERE id=?'
        db.run(sql,[page.title,page.author,page.creation_date,page.publication_date,page.admin,numPage],(err)=>{
            if(err) reject(err.message);
            else resolve(true);
        });
    });
}

function getPages(){
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * from pages';
        db.all(sql,(err,rows)=>{
            if(err) reject(err);
            else {
                const pages=rows.map(p=> new Page(p.id,p.title,p.author,p.creation_date,p.publication_date,p.admin));
                resolve(pages);
            }
        });
    });

}

function addPage(page) {
    return new Promise((resolve,reject)=>{
        const sql='INSERT INTO pages(title,author,creation_date,publication_date,admin) VALUES(?,?,?,?,?)';
        db.run(sql,[page.title,page.author,page.creation_date,page.publication_date,page.admin], (err)=>{
            if(err) reject(err.message);
            else resolve(true);
        });
    });
}
function deletePage ( id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM pages WHERE id=?';
      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        }
          resolve(null);
      });
    });
  }

exports.getPageById=getPageById;
exports.getPages=getPages;
exports.editPage=editPage;
exports.addPage=addPage;
exports.deletePage=deletePage;