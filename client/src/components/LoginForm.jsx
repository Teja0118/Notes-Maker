import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function LoginForm({setUserName, setIsLoggedIn}){
    //useNavigate: A hook from react-router-dom used to get the navigate function.
    //navigate function: Allows programmatic navigation to different routes.
    //Example Usage: Redirecting the user to the home page after a successful login or to the registration page when clicking the register button.
    const navigate = useNavigate();

    //state variable to store email and password during login
    const [loginDetails, setLoginDetails] = useState({
      email: "",
      password: "",
    });
  
    function handleLogin(event){
      const {name, value} = event.target;
      setLoginDetails(prevValue => {
        return (
          {
            ...prevValue,
            [name]: value,
          }
        )
      });
    }
  
    function validateLogin(event){
    event.preventDefault();
      const userData = {
        email: loginDetails.email,
        password: loginDetails.password,
      };
      fetch("/login",{
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(userData),
      })
      .then(response => {
            if(!response.ok){
                throw new Error("Login Failed");
            }
            return response.json();
      })
      .then(data => {
        if(data){
          setUserName(data.userName);
          setIsLoggedIn(true);
          localStorage.setItem("token-info", JSON.stringify(userData));
          (data.userType === "admin") ? navigate("/adminDashboard") : navigate("/home");
        }
        else{
          alert("Invalid Email or Password");
        }   
      })
      .catch(error => {
        console.log("Error: ", error);
        alert("An error occured during login");
      });
    }

    function redirectSignup(){
      navigate("/register");
    }
  
    return(
      <div>
        <Header />
        <div className = "login">
          <h2>Login</h2>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Enter email" 
                name = "email"
                value = {loginDetails.email}
                onChange = {handleLogin}
              />
              <br /><br />  
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" placeholder="Password" 
                name = "password"
                value = {loginDetails.password}
                onChange = {handleLogin}
              />
            </Form.Group>
            <br />
            <div className="loginBtn">
              <Button variant="primary" type="submit"
                onClick = {validateLogin}
              >
                Login
              </Button>
              <Button variant="primary" type="submit"
              onClick= {redirectSignup}
              >
                Sign Up
              </Button>
            </div>
          </Form>
          {/*
          <form>
            <input
              type = "email"
              name = "email"
              placeholder = "Email"
              value = {loginDetails.email}
              onChange = {handleLogin}
            />
            <br /><br />
            <input 
              type = "password"
              name = "password"
              placeholder = "Password"
              value = {loginDetails.password}
              onChange = {handleLogin}
            />
            <br />
            <br />
            <div className="loginBtn">
              <button onClick = {validateLogin}>Login</button>
              <button onClick= {redirectSignup}>Sign up</button>
            </div>
          </form>
          */}
        </div>
      </div>
     )
  }

export default LoginForm