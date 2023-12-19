import { Button, Col, Container, Form, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { ListPage } from "./ListPage";
import {useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {  deletePage, editPage, getContentById, getPageById, getPages, getTitle} from "./API";
import './App.css'
import {  AddContentForm, AddForm,EditForm } from "./AddOrEditForm";


function TitleLayout (props){
  const navigate=useNavigate();
  const [title_old,setTitle]=useState(props.title);
 
  useEffect(()=>{
    getTitle().then(t=>setTitle(t));
  },[])
  const handleAddTitle=()=>{
    props.setTitle(title_old);
      navigate('/');
  }
  const handleCancel=()=>{
    props.setTitle(title_old);
    navigate('/');
}
  return (<><Form className="title"><Form.Group>
        <Form.Label className='fw-light'>Set a title for the website</Form.Label>
        <Form.Control value={title_old} onChange={(ev)=>{setTitle(ev.target.value)}} type="title" name="title" placeholder="Enter a title"  />
      </Form.Group>
  <Button className="button" onClick={()=> handleAddTitle()}>Save</Button>{' '}
  <Button onClick={()=> handleCancel()}>Cancel</Button>
  </Form>
  </>);
}

function MainLayout(props){
  const navigate=useNavigate();
  const handleAdd=()=>{
    navigate('/addPage');
}
const handleClick=()=>{
  navigate('/frontOffice')
}
const handleSetTitle=()=>{
 navigate('/setTitle');
}
useEffect(()=>{
  getPages().then(list =>{
    props.setPages(list);
  });
},[props.pages]); 

    return <>
    
    <div >
  <Navbar bg="dark" expand="lg">
    <Container>
      <Navbar.Brand className="welcome mx-auto">{props.title}</Navbar.Brand> 
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* Sposta tutto alla fine */}
          <NavDropdown id="basic-nav-dropdown" title={props.user.name}>
            <NavDropdown.Item onClick={props.handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
</div>
  <ListPage log={true} pages={props.pages} setPages={props.setPages} user= {props.user} admin={props.user.admin}/>
  <div className="addOrGoButton"><Button  variant="light" className="buttonATF" onClick={handleAdd}>Add Page</Button> {''} {props.user.admin!= 0? <Button variant="light" className="buttonATF" onClick={handleSetTitle}>Set Title</Button> : ''}
  {' '}<Button  variant="light" className="buttonATF" onClick={handleClick}>Go to the FrontOffice</Button> </div>
  </>
   
}

function DefaultLayout (props) {
  return <>{ props.pages ? <UnLoggedLayout log={props.log} user={props.user} handleLogout={props.handleLogout} setTitle={props.setTitle} title={props.title} pages={props.pages} setPages={props.setPages}/> : ''}</>
}


function UnLoggedLayout (props){
  const navigate=useNavigate();
  const [pages,setPages]=useState();
  useEffect(()=>{
    getPages().then(list =>{
      props.setPages(list);
      setPages(list);
    });
  },[props.pages]); 
  
  const handleClick = () =>{
    navigate('/login');
  }
  const handleClickB=()=>{
    navigate('/')
  }
  if(!props.log){
      return <>
      
      <Navbar bg="dark" expand="lg"> <Navbar.Brand className="welcome">{props.title}</Navbar.Brand>
       <Button variant="outline-light" className="justify-content-end" onClick={handleClick}>Login</Button> 
      </Navbar>

      {pages ? <ListPage log={false} pages={pages} setPages={props.setPages}/> : ''}
      </>
  }
  else { return <div>
    <Navbar bg="dark" expand="lg">
    <Container>
      <Navbar.Brand className="welcome">{props.title}</Navbar.Brand> {/* Titolo al centro */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* Sposta tutto alla fine */}
          <NavDropdown id="basic-nav-dropdown" title={props.user.name}>
            <NavDropdown.Item onClick={props.handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  <ListPage log={false} pages={props.pages} setPages={props.setPages}/>
  <div><Button className="buttonATF" variant="light" onClick={handleClickB}>Go to the BackOffice</Button> </div>
</div>
  
  }
}
function EditLayout (props) {
  const {numPage}=useParams();
  const [page,setPage]=useState(null);
  const [content,setContent]=useState(null);
  useEffect (()=>{
    getPageById(numPage).then(p=>{
      setPage(p);
    });
  },[numPage]);
 
  useEffect(()=>{
    getContentById(numPage).then(c=>setContent(c));
  },[numPage]);
 
  const handleEdit =(numPage,page) =>{
    editPage(numPage,page);
    
  }

  return <>{page  && content? <EditForm  user={props.user} page={page} editPage={handleEdit} content={content} admin={props.user.admin}/> : ''}</>
}

function AddLayout(props){
  
  return <> 
  <AddForm setPages={props.setPages} pages={props.pages} user={props.user}/></>
}
function AddContentLayout(props){
  const [pageID,setPageID]=useState(null);
  const [page,setPage]=useState(null);
  const [author,setAuthor]=useState(props.user.name);
  useEffect(()=>{
    let pag=[...props.pages];
    let p=pag.splice(pag.length-1,1);
    setPageID(p[0].id);
    setAuthor(p[0].author);
    setPage(p[0]);
    
  },[]);
  const handleCancel=(numPage)=>{
    deletePage(numPage);
  }
  return <>{ pageID && page ? <AddContentForm page={page} author={author} user={props.user} handleAdd={props.addPage} cancelPage={handleCancel} pageID={pageID}  /> : ''}</>
}
export {MainLayout,DefaultLayout,EditLayout,AddLayout,AddContentLayout,TitleLayout}