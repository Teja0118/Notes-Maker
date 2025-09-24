import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import InputArea from "./InputArea";
import UpdateArea from "./UpdateArea";
import Note from "./Note";

function Home({userName, isLoggedIn, setIsLoggedIn}){
  //to store the useNavigate function
  const navigate = useNavigate();

  //data object to store the userName
  const data = {
    userName: userName,
  };

  //capitalized username
  const capUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

  //state variable to set result from select query
  const [backendData, setBackendData] = useState([]);

  //state variable to toggle between the add and update form
  const [isNew, setisNew] = useState(true);

  //state variable to store update note data
  const [updateData, setUpdateData] = useState({
    upId: "",
    upTitle: "",
    upContent: "",
  });

  //useEffect is used for fetching data
  //Here, we mentioned the /api endpoint for fetching the data
  useEffect(() => {
    fetch("/api", {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data),
    }).then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data);
      }
    )
  })
  
  //to add a new note
  //used fetch method
  //it takes method(get, post..), headers (type of content), and the data(required to precess the request)
  function addNote(newNote) {
    const { title, content } = newNote;
    const data = {
      title: title,
      content: content,
    };
  
    fetch("/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.text()) // Expecting a text response for this test
      .then(result => {
        console.log(result); // Log the server response
      })
      .catch(error => {
        console.log(error);
      });
  }

  //to delete a note
  //obtained id from the form of respective component
  //sending that id to the server to delete that particular record
  function deleteNote(id){
    const data = {
      id: id,
    };
    fetch("/delete", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    /*
    .then(
      response => response.text()
    )
    .then(
      data => {
        console.log(data);
      }
    )
    .catch(error => {
        console.log(error);
      }
    )
       */
  }

  //to update an existing note
  //got id, title, name from the submitted form using component tree concept
  //sent these three properties by wrapping them inside an existing and declared object state
  //on clicking update button setisNew set to false
  //now update from appears
  //this feature was obtained using ternary operator
  function updateNote(id, title, content){
    setUpdateData({
      upId: id,
      upTitle: title,
      upContent: content,
    })
    setisNew(false);
  }

  //got the updated note from the update form
  //sent that object to the server to process the update
  //setTimeout is used to toggle the form to new note one
  //setTimeout is used to delay the reload 
  //this gives time to complete the process from concerned forms
  //then complete work on server and db
  function saveChanges(changeNote){
    fetch("/update", {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changeNote),
    })
    setTimeout(() => {
      setisNew(true);  
    }, 500);
  }

  //to cancel updating a note
  //setisNew is set to true
  //this makes render of new note from making no update requests from the client side
  function cancelChanges(){
      setisNew(true);  
  }

  function handleLogout(){
    localStorage.removeItem("token-info");
    setIsLoggedIn(false);
    navigate("/");
  }

  function redirectLogin(){
    navigate("/");
  }

  /*
  function addNote(newNote){
    const {title, content} = newNote;
    const data = {
      title: title,
      content: content,
    }
    fetch("/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json, charset=UTF-8',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result=> {
      setBackendData(result)
    }).catch(error => {
      console.log(error)
    })
  }
  */

  
    return (
        <div>
            <Header />
            {isLoggedIn ? (
              <div className = "container">
              <div className="intro">
                <p><b>Welcome {capUserName}</b></p>
                <form>
                    <button onClick = {handleLogout}>Logout</button>
                </form>
              </div>
              <div className="noteContent">
                <div className='form'>
                  {
                  //ternary operator to switch between new and update form components
                  (isNew) ? 
                      <InputArea onAdd = {addNote} /> :
                      <UpdateArea 
                      id = {updateData.upId}
                      title = {updateData.upTitle}
                      content = {updateData.upContent}
                      onChanges = {saveChanges}
                      onCancel = {cancelChanges}
                      />
                  }
                </div>
                <div className="notes">
                  {
                  //to display existing note components
                  //checks whether the obtained data is 'undefined' or not
                  //if not renders all the notes in form od components
                  (typeof backendData.notes == 'undefined') ?
                      (<p>Loading...</p>):
                      (backendData.notes.map((note) => (
                        <Note 
                            key = {note.id}
                            id = {note.id}
                            title = {note.title}
                            content = {note.content}
                            onDelete = {deleteNote}
                            onUpdate = {updateNote}
                        />
                        /*
                        <div>       
                            <p key = {car.id}>{car.id} {car.title} {car.content}</p>
                            <button>Click</button>
                        </div>
                        */
                        )
                      ))
                  }
                </div>
                <div className="msg">
                    <p></p>
                </div>
              </div>    
          </div>
            ) : (
              <div className="sessionLoggedOut">
                <h2>You have already logged out...!</h2>
                <p>Click on the button to get back to Login Page</p>
                <form>
                  <button onClick = {redirectLogin}>Login</button>
                </form>
              </div>
            ) }
              
                 
        </div>
    )
}

export default Home