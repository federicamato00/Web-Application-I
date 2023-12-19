import { useEffect, useState } from "react"
import {   useNavigate, useParams } from "react-router-dom";
import { addContent, deleteContentById, editContent, getContentById, getPageById, getUserInfo, getUsers } from "./API";
import {   Button, Container, Form, ListGroup } from "react-bootstrap";
import { Content, Page } from "./Page";
import spiderman from "./images/spiderman.jpg";
import sanremo from "./images/sanremo.png"
import socialmedia from "./images/socialmedia.jpeg"
import supermario from "./images/supermario.webp"
import dayjs from "dayjs";

import "./App.css";

function EditForm (props){
    const {numPage}=useParams();
    const navigate=useNavigate();
    const [userL,setUserL]=useState(props.user);
    const [page,setPage]=useState(props.page || "");
    const [content,setContent]=useState(props.content || "");
    const [user,setUser]=useState();
    useEffect(()=>{
      getUsers().then(u=>setUser(u));
      getUserInfo(u=> setUserL(u));
    },[]);
   
    useEffect(()=>{
        getPageById(numPage).then(p=>setPage(p));
        getContentById(numPage).then(c=>setContent(c));
    },[numPage]);
    
    const [Cdate, setCDate] = useState(page.creation_date);
    const [Pdate, setPdate] = useState(page.publication_date) ;
    const [title, setTitle] = useState(page.title) ;
    const [author, setAuthor] = useState(page.author) ;
    const [err, setErr] = useState('')
    const [newadmin,setNewAdmin]=useState(page.admin);
    
    const handleChange=(value)=>{
      setAuthor(value);
      user.forEach(u=>
        {if(u.name==value){
        setNewAdmin(u.admin);}
      })
      
    }
    const handleEdit = () =>{
        if(title!=='' )
          {
            const edited=new Page (numPage,title,author,Cdate,Pdate,newadmin);
            props.editPage(numPage,edited);    
        }
        else
        {
          alert("title not valid");
        }
        
    }
    return <>
      <div>
        {err && <p>{err}</p>}
          <div className="formPage">
            <Form.Group controlId="Cdate">
            <Form.Label className='fw-light'>Creation date</Form.Label>
            <Form.Control disabled={userL.admin} value={dayjs(Cdate).format('YYYY-MM-DD')} onChange={(ev)=>{setCDate(ev.target.value)}} type="date" name="Cdate" placeholder="Enter a creation date"  />
        </Form.Group>
        <Form.Group controlId="Pdate">
            <Form.Label className='fw-light'>Publication date</Form.Label>
            <Form.Control value={dayjs(Pdate).format('YYYY-MM-DD')!="Invalid Date" ? dayjs(Pdate).format('YYYY-MM-DD') : ""} onChange={(ev)=>{setPdate(ev.target.value)}} type="date" name="Pdate" placeholder="Enter a publication date"/>
        </Form.Group>
        <Form.Group controlId="PageTitle">
            <Form.Label className='fw-light'>Page's title</Form.Label>
            <Form.Control value={title} onChange={(ev)=>{setTitle(ev.target.value)}} type="title" name="text" placeholder="Enter title" />
        </Form.Group>
        <Form>
      <Form.Group controlId="exampleForm.SelectCustom">
        <Form.Label>{author}</Form.Label>
        <Form.Select disabled={props.admin==0}
          value={author}
          onChange={(e) => handleChange(e.target.value)}
        >
          {user ? user.map(u => (
            <option key={u.name} value={u.name} option={u.admin}>
              {u.name}
            </option>
          )): ''}
        </Form.Select>
      </Form.Group>
    </Form>
        
        { numPage ? <EditContent  contents={content} numPage={numPage} handleEdit={handleEdit} name={author} /> : "" }
        </div>
    </div>
    </>
}



function AddForm(props) {
    const [Cdate, setCDate] = useState(null);
    const [Pdate, setPdate] = useState(null) ;
    const [title, setTitle] = useState(null) ;
    const [user,setUser]=useState(props.user);
    const [author,setAuthor]=useState(user.name);
    const [users,setUsers]=useState();
    const [id,setId]=useState(0);
    const [newadmin,setNewAdmin]=useState(user.admin);
    const handleChange=(value)=>{
      setAuthor(value);
      users.forEach(u=>{if(u.name==value){
        setNewAdmin(u.admin);}
      })
      
    }
    useEffect(()=>{
      getPageById(0).then(p=>setId(p.id +1 ));
    })
    useEffect(()=>{
      getUsers().then(u=>setUsers(u))
    });
    useEffect(() => {
        const init = async () => {
          try {
            const user = await getUserInfo();  // here you have the user info, if already logged in
            setUser(user);
            setAuthor(user.name);
           
            
          } catch (err) {
            setUser(null);
            
          }
        };
        init();
      }, []);

    const [err, setErr] = useState('')
    const navigate=useNavigate();

    const handleAdd = () =>{
        
        if(title!=null && Cdate!=null && title!="" && Cdate!="" )
       { 
        
        if(dayjs(Cdate).isValid())
       { 
        
        props.setPages([...props.pages,{id:id,title:title,author:author,creation_date:Cdate,publication_date:Pdate,admin:newadmin}])
        navigate(`/addContent/${id}`);}
        else alert("Insert a valid date");
      }
        else {
            alert('Insert a valid title and date');
        }
        
    }

    return <>
      <div>
        {err && <p>{err}</p>}<div className="formPage">
            <Form.Group controlId="Cdate">
            <Form.Label className='fw-light'>Creation date</Form.Label>
            <Form.Control  type="date" required={true} onChange={(ev)=>{setCDate(ev.target.value)}}  name="Cdate" placeholder="Enter a creation date (mm-dd-yyyy)"  />
        </Form.Group>
        <Form.Group controlId="Pdate">
            <Form.Label className='fw-light'>Publication date</Form.Label>
            <Form.Control type="date" required={false} onChange={(ev)=>{setPdate(ev.target.value)}} name="Pdate" placeholder="Enter a publication date (mm-dd-yyyy)"/>
        </Form.Group>
        <Form.Group controlId="PageTitle">
            <Form.Label className='fw-light'>Page's title</Form.Label>
            <Form.Control  onChange={(ev)=>{setTitle(ev.target.value)}} type="title" name="text" placeholder="Enter a title" />
        </Form.Group>
        <Form>
        <Form.Group controlId="exampleForm.SelectCustom">
        <Form.Label>{author}</Form.Label>
        <Form.Select disabled={user.admin==0}
          value={author}
          onChange={(e) => handleChange(e.target.value)}
        >
          {users ? users.map(u => (
            <option key={u.name} value={u.name} option={u.admin}>
              {u.name}
            </option>
          )): ''}
        </Form.Select>
      </Form.Group>
    </Form>
        <Form.Group>
          <Button variant='success' id="addbutton" onClick={() => handleAdd()}>SAVE</Button>
            {' '}<Button variant='secondary' id="addbutton" onClick={()=>navigate('/')}>CANCEL</Button>
        </Form.Group>
        </div>
    </div>
    </>
}
function AddContentForm(props){
      const numPage=props.pageID;
      const [fieldOrder, setFieldOrder] = useState([]);
      const navigate=useNavigate();
      const [user,setUser]=useState();
      const images=[spiderman,sanremo,socialmedia,supermario];
      let countP=0;
      let countH=0;
      let countI=0;
      useEffect(() => {
        const init = async () => {
          try {
            const user = await getUserInfo();  // here you have the user info, if already logged in
            setUser(user);
            
          } catch (err) {
            setUser(null);
            
          }
        };
        init();
      }, []);
      const handleAddField = (type) => {
        const fieldName = `${type}_${fieldOrder.length + 1}`;
        setFieldOrder([...fieldOrder, { type, name: fieldName }]);
      };
    
      const handleRemoveField = (fieldName) => {
        
        setFieldOrder(fieldOrder.filter((field) => field.name !== fieldName));
      };
    
      const handleFieldChange = (fieldName, event,type) => {
        const updatedFields = fieldOrder.map((field) => {
          if (field.name === fieldName ) {
            return { ...field, value: event.target.value };
          }
          return field;
        });
        setFieldOrder(updatedFields);
      };
    
      const handleFieldMove = (fieldName, newIndex) => {
        const fieldIndex = fieldOrder.findIndex((field) => field.name === fieldName);
        const field = fieldOrder[fieldIndex];
        const updatedFields = [...fieldOrder];
        updatedFields.splice(fieldIndex, 1);
        updatedFields.splice(newIndex, 0, field);
        setFieldOrder(updatedFields);
      };
      const handleCancel = () =>{
          navigate('/')
      }
      const handleSubmit = (event) => {
        event.preventDefault();
        let i=0;
        fieldOrder.forEach(c=>{
          
          if(c.value!="" && c.value!=null)
          c.type==='header' ? countH+=1 : c.type==='image' ? countI+=1 : countP+=1
        });
        if(countH>0 && (countI>0 || countP>0))
              {fieldOrder.map(content=>{
              if(
                content.value!="" && content.value!=null)
               {
                const con= new Content(numPage,content.type,content.value,props.author,i+1);
                i+=1;
                addContent(con);
              }
               });
          
               props.handleAdd(props.page);
               navigate('/');}
        else {
          alert("Insert at least one header and at least one image or paragraph")
        }
         
      };
    
      return (
        <Container className="formPage">
          <h1>Add some blocks</h1>
    
          <Form onSubmit={handleSubmit} >
            <Form.Group controlId="fields">
              <Form.Label>Content</Form.Label>
              {fieldOrder.map((field, index) => {
                const fieldValue = field.value || '';
                return (
                  <div key={field.name}> <p>{field.type==='header' ? 'Header' : field.type==='image' ? 'Image' : field.type==='paragraph' ? 'Paragraph': ''}</p>
                    {field.type === 'header' && (
                      <Form.Control
                        type="text"
                        value={fieldValue}
                        onChange={(event) => handleFieldChange(field.name, event,field.type)}
                      />
                    )}
                    {field.type === 'paragraph' && (
                      <Form.Control
                        as="textarea"
                        value={fieldValue}
                        onChange={(event) => handleFieldChange(field.name, event,field.type)}
                      />
                    )}
                    {field.type === 'image' && (
                       <Form.Group >
                         <Form.Select 
                          value={fieldValue || " "}
                          onChange={(e) => handleFieldChange(field.name,e,field.type)}
                       >
                         <option value="">Select an image</option>
                         {images ? images.map(u => (
                         <option key={u} value={u} option={u} >
                          {u.split('/')[3].split('.')[0]}
                         </option>
                        )): ''}
                     </Form.Select> </Form.Group>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveField(field.name,field.type)}
                    >
                      Remove
                    </Button> {' '}
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => handleFieldMove(field.name, index - 1)}
                      disabled={index === 0}
                    >
                      Move up
                    </Button> {' '}
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => handleFieldMove(field.name, index + 1)}
                      disabled={index === fieldOrder.length - 1}
                    >
                      Move down
                    </Button>
                  </div>
                );
              })}
            </Form.Group>
    
            <Button variant="outline-light" onClick={() => handleAddField('header')}>
              Add an header
            </Button>{' '}
            <Button variant="outline-light" onClick={() => handleAddField('paragraph')}>
              Add a paragraph
            </Button>{' '}
            <Button variant="outline-light" onClick={() => handleAddField('image')}>
              Add an image
            </Button>{' '}
            <Button variant="outline-success" type="submit">
              Save
            </Button> {' '}
            <Button variant="danger" onClick={() => handleCancel()}>
              Delete
            </Button>
          </Form>
    
          <hr />
    
          <h2>Preview</h2>
          <ListGroup>
            {fieldOrder.map((field) => (
              <ListGroup.Item key={field.name}>
                <h3>{field.type === 'header'  ? 'Header' :  field.type ==='paragraph' ? 'Paragraph' : field.type==='image' ? 'Image' : '' }</h3>
                {field.value}
                
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      );

}
function EditContent(props){
  const numPage=props.numPage;
  const images=[spiderman,sanremo,socialmedia,supermario];
  const navigate=useNavigate();
  let countP=0;
  let countH=0;
  let countI=0;
  
  const [removed,setRemoved]=useState([]);
  const [fields, setFields] = useState(props.contents || "");
  fields.forEach(f=>{
    f.type==='header' ? countH+=1 : f.type==='paragraph' ? countP+=1 : countI+=1
  })
  
  const handleAddField = (type) => {
    const fieldName = `${type}_${fields.length + 1}`;
    let newField= {type , fieldName, content: ""};
    if(type==="image")
    {
      newField= {...newField, selectedImage:""}
    }
    setFields([...fields, newField]);
  };

  const handleFieldChange = (index, field, value,type) => {
    const updatedFields = [...fields];
    
    if(type==="image"){
      
      updatedFields[index].selectedImage=value;
    }
    
     updatedFields[index][field] = value;
    {type==='header' ? countH+=1 : type==='paragraph' ? countP+=1 : countI+=1}
    setFields(updatedFields);
  };

  const removeField = (index, type) => {
    const updatedFields = [...fields] || "";
    const removedItem = updatedFields.splice(index, 1);
    setRemoved((prevRemoved) => [...prevRemoved, ...removedItem]);
    {type === "header" ? countH -= 1 : type === "paragraph" ? countP -= 1 : countI -= 1}
    setFields(updatedFields);
  };
 

  const moveField = (index, direction) => {
    const updatedFields = [...fields];
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < updatedFields.length) {
      const temp = updatedFields[index];
      updatedFields[index] = updatedFields[newIndex];
      updatedFields[newIndex] = temp;
      setFields(updatedFields);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    let i=0;
    if(countH>0 && (countP>0 || countI>0))
              {fields.map(content=>{
                let value;
                if(content.type==='image') {
                  if(content.selectedImage){
                    value=content.selectedImage;
                  }
                  else
                    value=content.content;
                }
                else value=content.content;
                if(value!="")
               { 
                const con= new Content(numPage,content.type,value,props.name,i+1);
                i+=1;
                editContent(con,content.id);
                
              }
               });
               { removed ? removed.map(content=>{
                deleteContentById(content.id);
               }): ""}
               props.handleEdit();
               navigate('/');
              }
    else {
      alert("Insert at least one header and at least one of paragraph or image");
    }
              
  };

  return (
    <Container > 
      <h1>EDIT</h1>
      
      <Form onSubmit={handleSubmit} >
        {fields.map((field, index) => (
          <div key={index} className="form-field"> 
            {field.type==='header'  && (<Form.Group controlId={field.type==='header' ? `header-${index}`: ''}>
              <Form.Label>{field.type==='header'? 'Header': field.type==='Paragraph'? 'Paragraph' : ''}</Form.Label>
               <Form.Control
                type='text'
                value={field.content} 
                disabled={props.disabled==0}
                onChange={(e) => handleFieldChange(index,'content', e.target.value,field.type)}
              />
            </Form.Group>)}
            {field.type==='paragraph' && ((<Form.Group controlId={ field.type==='paragraph' ? `paragraph-${index}` : ''}>
              <Form.Label>{field.type==='Paragraph'? 'Paragraph' : ''}</Form.Label>
               <Form.Control
                type='textarea'
                value={field.content} 
                disabled={props.disabled==0}
                onChange={(e) => handleFieldChange(index,'content', e.target.value,field.type)}
              />
            </Form.Group>))}
            {field.type==='image' && (
            
            <Form.Group controlId={`image-${index}`}>
              <Form.Label>Image</Form.Label>
                <Form.Select 
                 value={field.selectedImage || field.content || " "}
                 onChange={(e) => handleFieldChange(index,"selectedImage",e.target.value,field.type)}
              >
                <option value="">Select an image</option>
                {images ? images.map(u => (
                <option key={u} value={u} option={u} >
                 {u.split('/')[3].split('.')[0]}
                </option>
               )): ''}
            </Form.Select>
          </Form.Group>)
        }

            <Button variant="outline-danger" onClick={() => removeField(index,field.type)} disabled={props.disabled==0}>Remove</Button>

            {index !== 0 && (
              <Button variant="outline-light" disabled={props.disabled==0} onClick={() => moveField(index, -1)}>Move up</Button>
            )}

            {index !== fields.length - 1 && (
              <Button variant="outline-light" disabled={props.disabled==0} onClick={() => moveField(index, 1)}>Move down</Button>
            )}


            <hr />
          </div>
        ))}

<Button variant="success" type="submit" disabled={props.disabled==0}>Salva</Button> {' '}
<Button variant="outline-light" onClick={() => handleAddField('header')} disabled={props.disabled==0}>
              Add an header
            </Button> {' '}
            <Button variant="outline-light" disabled={props.disabled==0} onClick={() =>  handleAddField('paragraph')}>
              Add a paragraph
            </Button> {' '}
            <Button variant="outline-light" disabled={props.disabled==0} onClick={() => handleAddField('image')}>
              Add an image
            </Button> {' '}
            <Button variant="danger" onClick={()=> navigate('/')} >Cancel</Button>
           
      </Form>
    </Container>
  );



}

export {EditForm,AddForm,AddContentForm}