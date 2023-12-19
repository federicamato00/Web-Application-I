import dayjs from 'dayjs';
import { Content, Page, User } from './Page';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}



/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}

async function getContentById(id){
  try {
    const response = await fetch (SERVER_URL + `page/${id}`);
    if(response.ok){
      const contents=await response.json();
      return contents;
    }
  }
  catch(error){
    throw new Error("Network Error: "+error.message);
  }
}
const getTitle=async()=>{
  return getJson(fetch(SERVER_URL+'getTitle')).then(title=>{ return title}).catch(err=>{throw(err);});
}
async function editTitle(title){
  try {
      const response=await fetch(SERVER_URL+`editTitle`, {
          method: 'POST',
          headers: {
              'Content-Type': "application/json",
          },
          body: JSON.stringify(
              {
                  "title":title
              }
          )
      });
      if(response){
          return true;
      } else {
          const message=response.text();
          throw new Error("Application Error: "+ message);
      }
      } catch (err){
          throw new Error("Network error: "+ err.message);
  
      }
}
const getPageById = async (pageID) => {
  return getJson( fetch(SERVER_URL + `editPage/${pageID}`, { credentials: 'include' }))
    .then( page => {
      return new Page(page.id,page.title,page.author,page.creation_date,page.publication_date,page.admin);
    } ).catch(error =>{
      throw(error);
    });
}


async function getUsers() {

  try {
    const response= await fetch (SERVER_URL+'users');
    if(response.ok){
      const users=await response.json();
      return users;
    }
  }
  catch(error){
    throw new Error("Network Error: "+error.message);
}
}

async function getPages() {
  try {
    const response= await fetch (SERVER_URL+'logged');
    if(response.ok){
      const pages=await response.json();
      return pages;
    }
  }
  catch(error){
    throw new Error("Network Error: "+error.message);
  }
}

async function getContent() {
  try {
    const response= await fetch (SERVER_URL);
    if(response.ok){
      const contents=await response.json();
      return contents;
    }
  }
  catch(error){
    throw new Error("Network Error: "+error.message);
  }
}

async function editPage(id,page){
  try {
      const response=await fetch(SERVER_URL+`editPage/${id}`, {
          method: 'POST',
          headers: {
              'Content-Type': "application/json",
          },
          body: JSON.stringify(
              {
                  "title":page.title,
                  "author":page.author,
                  "creation_date":page.creation_date,
                  "publication_date":page.publication_date,
                  "admin": page.admin
              }
          )
      });
      if(response){
          return true;
      } else {
          const message=response.text();
          throw new Error("Application Error: "+ message);
      }
      } catch (err){
          throw new Error("Network error: "+ err.message);
  
      }
}
async function editContent(content,id){
  try {
    const response=await fetch(SERVER_URL+`editContent`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(
          {
            "pageID":content.id,
            "type":content.type,
            "content":content.content,
            "user":content.user,
            "ordered": content.order,
            "id": id
        }
        )
    });
    if(response){
        return true;
    } else {
        const message=response.text();
        throw new Error("Application Error: "+ message);
    }
    } catch (err){
        throw new Error("Network error: "+ err.message);

    }
}
async function addPage(page){
  
  return getJson(
    fetch(SERVER_URL + "addPage", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(page) 
    })
  )

}
async function addContent(content){
  return getJson(
    fetch(SERVER_URL + "addContent", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(content) 
    })
  )

}
function deletePage(numPage) {
  return getJson(
    fetch(SERVER_URL +'deletePage/'+ numPage, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}
function deleteContent(numPage) {
  return getJson(
    fetch(SERVER_URL + "deleteContent/"+numPage, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}
function deleteContentById(id) {
  return getJson(
    fetch(SERVER_URL + "deleteContentById/"+id, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}


export {getUserInfo,logIn,logOut,getContentById,
  getPages,getContent,getPageById,editPage,addPage,deletePage,addContent,deleteContent,
editContent,deleteContentById,getUsers,getTitle,editTitle}