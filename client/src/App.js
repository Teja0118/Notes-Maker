import React, { useState } from 'react';
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import AdminDashboard from './components/AdminDashboard';
import Register from "./components/Register";
import RegSuccess from "./components/RegSuccess";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

  function App(){
    //to store username received as response from the server
    const [userName, setUserName] = useState("");

    //to store the state of user logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return(
      <Router>
        <Routes>
          <Route 
            path = "/" 
            element = {<LoginForm setUserName = {setUserName} setIsLoggedIn = {setIsLoggedIn}/>} 
          />
          <Route 
            path = "/home" 
            element = {
              <Home userName = {userName} isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />           
            } 
          />
          <Route 
            path = "/adminDashboard"
            element = {<AdminDashboard userName = {userName} isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn}/>}
          />
          <Route
            path = "/register" 
            element = {<Register />} 
          />
          <Route
            path = "/regSucess"
            element = {<RegSuccess />}
          />
        </Routes>
      </Router>
    )
  }

export default App