'use strict';

const { resolve } = require('path');

const db=require('./db');


function getTitle(){
    return new Promise((resolve,reject)=>{
        const sql = 'SELECT * from title';
        db.get(sql,(err,row)=>{
            if(err) reject(err);
            else {
                const title=row.title;
                resolve(title);
            }
        });
    });
}

function editTitle(title){
    return new Promise((resolve,reject)=>{
        const sql = 'UPDATE title SET title=?';
        db.run(sql,[title],(err)=>{
            if(err) reject(err);
            else {
                resolve(true);
            }
        });
    });
}

exports.editTitle=editTitle;
exports.getTitle=getTitle;