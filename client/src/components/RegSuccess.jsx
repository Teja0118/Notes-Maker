import React,{useState} from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

function RegSuccess(){
    const [show, setShow] = useState(true);

    //to use navigate function
    const navigate = useNavigate();

    //to regdirect to the login page
    function loginRedirect(){
        navigate("/");
    }

    return(
        <div>
            <Alert show={show} variant="success">
                <Alert.Heading>You have registered successfully...!</Alert.Heading>
                <p> Click here to Login</p>
                <hr />
                <div className="d-flex justify-content-end">
                <Button onClick = {loginRedirect} variant="outline-success">
                    Login
                </Button>
                </div>
            </Alert>
            {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>}
            {/*
                <h2>You have registered successfully...!</h2>
                <p>Click here to Login</p>
                <form>
                    <button onClick = {loginRedirect}>Login</button>
                </form>
            */}
            
        </div>
    )
}

export default RegSuccess