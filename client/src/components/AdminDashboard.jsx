import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import ListGroup from 'react-bootstrap/ListGroup';


function AdminDashboard({userName, isLoggedIn, setIsLoggedIn}){
    // to store the useNavigate function
    const navigate = useNavigate();

    // to store the user details retrieved from the server
    const [userData, setUserData] = useState({ users: [] });

    //capitalized username
     const capUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

    useEffect(() => {
        fetch("/users", {
            method: 'GET',
            headers: {
                "content-type": 'application/json',
            }
        })
        .then(
            response => response.json()
        )
        .then(
            data => {
                setUserData(data);
            }
        )
    })

    // redirect to login after session logout
    function redirectLogin(){
        navigate("/");
    }

    // to handle the logout 
    function handleLogout(){
        setIsLoggedIn(false);
        localStorage.removeItem("token-info");
        navigate("/");
    }

    return(
        <div>
            { isLoggedIn ? (
                <div>
                    <Header />
                    <div className="intro">
                        <p><b>Welcome {capUserName}</b></p>
                        <form>
                            <button onClick = {handleLogout}>Logout</button>
                        </form>
                    </div>
                    <br />
                    <ListGroup as="ol" numbered>
                        {
                            userData.users.map((user, index) => (
                                <ListGroup.Item as="li" key = {index}>{user.username}</ListGroup.Item>
                            )) 
                        }
                    </ListGroup>
                </div>
            ) :
            (
                <div className="sessionLoggedOut">
                    <h2>You have already logged out...!</h2>
                    <p>Click on the button to get back to Login Page</p>
                    <form>
                        <button onClick = {redirectLogin}>Login</button>
                    </form>
                </div>
            )
            }
        </div>        
    )
}
export default AdminDashboard