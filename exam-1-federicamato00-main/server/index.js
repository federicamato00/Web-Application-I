'use strict';


const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {check,validationResult} = require('express-validator');

const userDao=require('./user-dao');
const pagesDao=require('./pages-dao');
const contentDao=require('./content-dao');
const titleDao=require('./title-dao');
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };
  app.use(cors(corsOptions));

  /** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password)
    if(!user)
      return callback(null, false, 'Incorrect username or password');  
      
    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
  }));
  
  // Serializing in the session the user object given from LocalStrategy(verify).
  passport.serializeUser(function (user, callback) { // this user is id + username + name 
    callback(null, user);
  });
  
  // Starting from the data in the session, we extract the current (logged-in) user.
  passport.deserializeUser(function (user, callback) { // this user is id + email + name 
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
    // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
  
    return callback(null, user); // this will be available in req.user
  });
  
  /** Creating the session */
  const session = require('express-session');
  const { Page, Content } = require('./Page');
  
  app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.authenticate('session'));
  
  
  /** Defining authentication verification middleware **/
  const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
  }
  

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => { 
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser() in LocalStratecy Verify Fn
          return res.json(req.user);
        });
    })(req, res, next);
  });
  
  // GET /api/sessions/current
  // This route checks whether the user is logged in or not.
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });
  app.get('/api/getTitle', async(req, res) => {
    try {

      const title= await titleDao.getTitle();
      res.json(title);
      
      
    }catch(error){
      res.status(500).send(error.message);
    }
  });
  app.post('/api/editTitle', async (req, res) => {
    const bodyanswer = req.body;
    try {
        await titleDao.editTitle(bodyanswer.title);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
})
  
  // DELETE /api/session/current
  // This route is used for loggin out the current user.
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.status(200).json({});
    });
  });

  app.get('/api/page/:numPage',async (req,res) =>{
    const numPage=req.params.numPage;
    try {
      const content=await contentDao.getContentById(numPage);
      res.json(content);
    }catch(error){
      res.status(500).send(error.message);
    }
  });
  app.get('/api/editPage/:numPage',async (req,res) =>{
    const numPage=req.params.numPage;
    try {

      const page=await pagesDao.getPageById(numPage);
      res.json(page);
      
      
    }catch(error){
      res.status(500).send(error.message);
    }
  });
  app.post('/api/editPage/:numPage', async (req, res) => {
    const numPage=req.params.numPage;
    const bodyanswer = req.body;
    const page = new Page(numPage, bodyanswer.title, bodyanswer.author, bodyanswer.creation_date, bodyanswer.publication_date, bodyanswer.admin);
    try {
        await pagesDao.editPage(numPage,page);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
})
app.post('/api/editContent', async (req, res) => {
  const content = req.body;
  const id=req.body.id;
  try {
      await contentDao.editContent(content,id);
      res.end();
  } catch (error) {
      
      res.status(500).send(error.message);
      
  }
})
  app.get('/api',async(req,res)=>{
    try
  {    const contents=await contentDao.getContent();
    res.json(contents);
  }
    catch(error){
      res.status(500).send(error.message);
    }
  });
 

  app.get('/api/logged',async (req,res) =>{
    try {
      const pages=await pagesDao.getPages();
      res.json(pages);
    }catch(error){
      res.status(500).send(error.message);
    }
  });
  app.get('/api/users',async (req,res) =>{
    try {
      const users=await userDao.getUsers();
      res.json(users);
    }catch(error){
      res.status(500).send(error.message);
    }
  });

  app.post('/api/addPage',
  isLoggedIn,
  async (req, res) => {

    // WARN: note that we expect watchDate with capital D but the databases does not care and uses lowercase letters, so it returns "watchdate"
    const page = {
      id: null,
      title: req.body.title,
      author: req.body.author,
      creation_date: req.body.creation_date, // A different method is required if also time is present. For instance: (req.body.watchDate || '').split('T')[0]
      publication_date: req.body.publication_date,
      admin: req.body.admin  // user is overwritten with the id of the user that is doing the request and it is logged in
    };
    try {
      const result = await pagesDao.addPage(page); // NOTE: addPage returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new page: ${err}` }); 
    }
  }
);

app.post('/api/addContent',
isLoggedIn,
async (req, res) => {

  const content = {
    id: req.body.id,
    type:req.body.type, // A different method is required if also time is present. For instance: (req.body.watchDate || '').split('T')[0]
    content:req.body.content,
    author: req.body.user,
    order: req.body.order
  };

  try {
    const result=await contentDao.addContent(content);
    res.json(result);
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of new content: ${err}` }); 
  }
}
);
app.delete('/api/deletePage/:numPage',
  isLoggedIn,
  [ check('numPage').isInt() ],
  async (req, res) => {
    try {
      const result = await pagesDao.deletePage(req.params.numPage);

      if (result == null )
        return res.status(200).json({}); 
        else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of page ${req.params.numPage}: ${err}` });
    }
  }
);
app.delete('/api/deleteContent/:numPage',
  isLoggedIn,
  [ check('numPage').isInt() ],
  async (req, res) => {
    try {
      const result = await contentDao.deleteContent(req.params.numPage);
      if (result == null )
       {
        return res.status(200).json({}); }
        else
       { 
         return res.status(404).json(result);}
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of content ${req.params.numPage}: ${err}` });
    }
  }
);
app.delete('/api/deleteContentById/:id',
  isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      const result = await contentDao.deleteContentById(req.params.id);
      if (result == null )
       {
        return res.status(200).json({}); }
        else
       { 
         return res.status(404).json(result);}
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of content ${req.params.numPage}: ${err}` });
    }
  }
);
const PORT=3001;
app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });