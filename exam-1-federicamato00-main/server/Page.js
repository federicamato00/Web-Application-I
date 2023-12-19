'use strict'

const dayjs=require('dayjs')

function Page(id,title,author,creationDate,publishedDate,admin)
{
    this.id=id;
    this.title=title;
    this.author=author;
    this.creation_date=dayjs(creationDate).format('MM-DD-YYYY');
    this.publication_date=dayjs(publishedDate).format('MM-DD-YYYY');
    this.admin=admin;
    

}
function User(name,admin){
    this.name=name;
    this.admin=admin;
}

function Content(id,type,content,user,order){
    this.id=id;
    this.type=type;
    this.content=content;
    this.user=user;
    this.order=order;
}
exports.Page=Page;
exports.Content=Content;
exports.User=User;