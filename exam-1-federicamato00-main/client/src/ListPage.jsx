import { useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Row, Tab, Table } from "react-bootstrap"
import {PencilSquare} from "react-bootstrap-icons"
import { Link, useNavigate } from "react-router-dom"
import { deleteContent, deletePage, getPages } from "./API";
import "./ShowPage.css"
import dayjs from "dayjs";

function ListPage(props){
  const [pages,setPages]=useState(props.pages);
  useEffect(()=>{
    if(!props.log)
    {
      getPages().then(p=>{
      setPages(p);
      const date=dayjs().format('MM-DD-YYYY');
      setPages(pages.filter(p=>dayjs((p.publication_date)).diff(date)<=0));
    });}
    else
    {
      getPages().then(p=>{
        setPages(p);
      })
    }
  },[pages]);
  

  
    let sortedPages = [...pages]
   
    sortedPages.sort((a, b) => {
      if(a.publication_date>b.publication_date)
      {
        return 1;
      }
      else {
        return -1;
      }
    });
        



    return <>
      {sortedPages ? sortedPages.map(p=> <PageRow key={p.id} page={p} log={props.log} user={props.user} admin={props.admin}/>): ''}
    </>
}
function PageRow(props){
    const navigate=useNavigate();
  const deletePageAndContent = (numPage) => {
      deletePage(numPage);
      deleteContent(numPage);
  }
  
 
    return<>
    
    <Card className="listPage">
      <Card.Header>{props.page.author}</Card.Header>
      <Card.Body>
        <Card.Title>{props.page.title}</Card.Title>
        {props.page.publication_date!="Invalid Date" ? <Card.Text>Published on {dayjs(props.page.publication_date).format('DD/MM/YYYY')}</Card.Text> : <Card.Text>Draft</Card.Text>}
        <Button variant="outline-dark" onClick={()=>navigate(`/page/${props.page.id}`)}>Show more</Button> {' '}
        {props.log ? <Button variant= "outline-dark" disabled={props.user.name!==props.page.author && props.admin==0} onClick={()=>navigate(`/editPage/${props.page.id}`)}>Edit</Button> : ''}
        {' '}
        {props.log ? <Button variant= "outline-danger" disabled={props.user.name!==props.page.author && props.admin==0} onClick={()=>deletePageAndContent(props.page.id)}>Delete</Button> : ''}
      </Card.Body>
      <Card.Footer className="text">Created on {dayjs(props.page.creation_date).format('DD/MM/YYYY')}</Card.Footer>
    </Card>
    </>
}
export {ListPage}
