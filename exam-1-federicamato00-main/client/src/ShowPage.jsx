import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getContentById, getPages } from "./API";
import image1 from './images/spiderman.jpg';
import image2 from './images/sanremo.png';
import image3 from './images/socialmedia.jpeg'
import image4 from './images/supermario.webp'
import { Badge, Col, Row } from "react-bootstrap";

import './ShowPage.css'
import dayjs from "dayjs";

function ShowContent (props){
    const {numPage}=useParams();
    const [page,setPages]=useState([...props.pages]);
    const [content,setContent]=useState([...props.content]);
    useEffect(()=>{
        
        getContentById(numPage).then(pg=>{
           setContent(pg);
        });
        getPages().then(page=>setPages(page));
    },[numPage]);
    const p=page.filter(p=>p.id==numPage)[0]
    return <><div className="content">{ page ? <PageRow page={page.filter(p=>p.id==numPage)[0]}/> : ''}
    {content.map(c=><ContentRow key={c.id} content={c}  />)}
    <Row>
       {p && p.publication_date!="Invalid Date" ? <Col md={4} className="publicationdate">Published on {dayjs(p.publication_date).format('DD/MM/YYYY')}</Col>
       : <Col md={4} className="publicationdate">Draft </Col>
       }
    </Row>  </div></>
}
function PageRow(props){
    return <div>
    <Row>
        <Col>
        <p className="text-end" >Created by {props.page ? props.page.author+ ' ': ''}
             on {props.page ? dayjs(props.page.creation_date).format('DD/MM/YYYY') : ''}</p>
            <p className="bold" >{props.page ? props.page.title : ''}</p>
             
        </Col>
    </Row>
    

</div>
}
function ContentRow(props){
    const c=props.content;
   return <>
    {c.type=='header'? <Row   className="header">{c.content}</Row> : ''}
    {c.type=='paragraph' ? <Row   className="paragraph"><p>{c.content}</p></Row> : ''}
    {c.type=='image' ? <Row className="image1">
    <div className="image-container">
    {c.content===image1 ? <img src={image1} />: c.content===image2? <img src={image2} className="image" />: c.content===image3 ? 
    <img src={image3} className="image" />:  c.content===image4 ? <img src={image4} className="image" /> : ''}
    </div>
    </Row> : ''}
    
    </>

}
export {ShowContent}