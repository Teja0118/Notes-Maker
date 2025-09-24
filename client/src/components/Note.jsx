import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Note(props){

    //sending id of respective note to the concerned function to process the delete using 'id'
    function onDelete(event){
        props.onDelete(props.id);
        event.preventDefault();
    }

    //sending id, title and content of respective note to the concerned function to process the update using 'id'
    function onUpdate(event){
        props.onUpdate(props.id, props.title, props.content);
        event.preventDefault();
    }
    return(
        <div >
            <Card className="note">
                <Card.Header as="h2">{props.title}</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {props.content}
                    </Card.Text>
                    <div className="btn bottom">
                        <Button className = "noteBtn" variant="primary" onClick = {onDelete}>Delete</Button>
                        <Button className = "noteBtn" variant="primary" onClick = {onUpdate}>Update</Button>
                    </div>        
                </Card.Body>
            </Card>
            {/* 
                <h2>{props.title}</h2>
                <p className="content">{props.content}</p>
                <form>
                    <div className="btn bottom">
                        <button onClick = {onDelete}>Delete</button>
                        <button onClick = {onUpdate}>Update</button>
                    </div>
                </form>
            */}
        </div>
    )
}

export default Note