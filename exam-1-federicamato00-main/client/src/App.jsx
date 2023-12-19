import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {  AddContentLayout, AddLayout, DefaultLayout, EditLayout, MainLayout, TitleLayout } from './Layout';
import { useEffect, useState } from 'react';
import { FormLogin } from './FormLogin';
import {  addPage, editTitle, getContent, getPages, getTitle, getUserInfo, logIn, logOut } from './API';
import UserContext from './UserContext';
import { ShowContent } from './ShowPage';


function App() {

  const [user,setUser]=useState({});
  const [log,setLog]=useState(false);
  const [loading,setLoading]=useState(false);
  const [title,setTitle]=useState(null);
  const [pages,setPages]=useState([]);
  const [content,setContent]=useState([]);
  
  useEffect(()=>{
    if(title!=null)
    editTitle(title);
  },[title]);
  useEffect(()=>{
    getTitle().then(t=>setTitle(t));
  },[]);
  
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await getUserInfo();  // here you have the user info, if already logged in
        setUser(user);
        setLog(true); setLoading(false);
      } catch (err) {
        setUser(null);
        setLog(false); setLoading(false);
      }
    };
    init();
  }, []);  // This useEffect is called only the first time the component is mounted.


  const handleLogin = async (credentials) => {
    try {
      const user = await logIn(credentials);
      setUser(user);
      setLog(true);
      
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */ 
  const handleLogout = async () => {
    await logOut();
    setLog(false);
    // clean up everything
    setUser(null);
    setPages([]);
  };

  useEffect(()=> //load the list of pages from the API server
  {
    getPages().then((list)=>{
      setPages(list);
    }) ;
  },[user]);
  
  useEffect(()=> //load the list of content from the API server
  {
    getContent().then((list)=>{
      setContent(list);
    }) 
  },[user]);
 
  const handleAddPage = (page) =>{
    addPage(page);
    setPages([...pages]);
  }
  return (
    <> <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ log ? <MainLayout title={title} handleLogout={handleLogout} user={user} pages={pages} setPages={setPages} /> : <DefaultLayout log={log} user={user} setTitle={setTitle} title={title} pages={pages} setPages={setPages}/>}/>
          <Route path='/frontOffice' element={  <DefaultLayout log={log} handleLogout={handleLogout} user={user} setTitle={setTitle} title={title} pages={pages} setPages={setPages}/>}/>
          <Route path='/login' element={!log ? <FormLogin login={handleLogin} /> : <Navigate replace to= '/'/>}/>
          <Route path='/editPage/:numPage' element={<EditLayout user={user}/>}/>
          <Route path='/setTitle' element={<TitleLayout title={title} setTitle={setTitle}/>}/>
          <Route path='/addPage' element={<AddLayout user={user} pages={pages} setPages={setPages}/>}/>
          <Route path='/addContent/:numPage' element={<AddContentLayout user={user} pages={pages} setPages={setPages} addPage={handleAddPage}/>}/>
          <Route path='/page/:numPage' element={<ShowContent content={content} pages={pages} />}/>
        </Routes>
      </BrowserRouter>
      </UserContext.Provider>
    
    </>
  )
}

export default App
