import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function InputArea(props){
    //a state to store new note data
    const [note, setNote] = useState({
        title: "",
        content: "",
    });

    //whenever a change os encountered in the input fields this function is called
    //this function updates the note using setNote
    //by setting new value and leaving behind the existing data unchanged
    function handleChange(event){
        const {name, value} = event.target;
        setNote(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }; 
        });
    }

    //to send the new note data to the concerned function to add the new note
    //then set the state of new note variables to empty strings
    function submitNote(event){
        if(((note.title).length >= 5) && ((note.title).length <= 50) && ((note.content).length >= 15) && ((note.content).length <= 350)){
            props.onAdd(note);
            setNote({
                title: "",
                content: "",
            });
            
        }
        else if(note.title === "" || note.content === ""){
            alert("Input fields can't be empty...!");
        }
        else if((note.title).length < 5){
            if((note.title).length > 50){
                alert("Title length should be of minimum 5 characters and maximum of 50 characters.");
            }
            else{
                alert("Title length should be of minimum 5 characters");
            }
        }
        else if((note.content).length < 15){
            if((note.content).length > 350){
                alert("Content length should be of minimum 15 characters and maximum 350 characters");
            }
            else{
                alert("Content length should be of minimum 15 characters");
            }
        }
        event.preventDefault();
    }

    return (
        <div className = "inputArea">
            <h2>New Note</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control  
                        name = "title"
                        type = "text"
                        onChange = {handleChange}
                        value = {note.title} 
                        placeholder = "Title"
                    />
                </Form.Group>
                <br />
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={5} 
                        name = "content"
                        onChange = {handleChange}
                        value = {note.content}
                        placeholder = "Content"
                    />
                </Form.Group>
                <br />
                <br />
                <Button variant="primary" type="submit" onClick = {submitNote}>
                    Add
                </Button>
            </Form>
            {/*
                 <form>
                    <input 
                        name = "title"
                        type = "text"
                        onChange = {handleChange}
                        value = {note.title} 
                        placeholder = "Title"
                    />
                    <br />
                    <br />
                    <textarea 
                        name = "content"
                        onChange = {handleChange}
                        value = {note.content}
                        placeholder = "Content"
                        rows= "5"
                    />
                    <br />
                    <br />
                    <button onClick = {submitNote}>
                        Add
                    </button>
                </form>
            */}
           
        </div>
    )
}

export default InputArea