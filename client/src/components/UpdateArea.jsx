import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function UpdateArea(props){
    //state for setting updated note
    const [updateNote, setUpdateNote] = useState({
        id: props.id,
        title: props.title,
        content: props.content
    })

    //to handle data when any change occured in the input and textarea fields
    //to update the note
    function handleChange(event){
        const {name, value} = event.target;
        setUpdateNote(prevNote => {
            return({
                ...prevNote,
                [name]: value
            });
        });
    }

    //to send the updated note to the concerned function to process the update
    //after that setting the update note state properties to empty strings for future operations usage
    function saveChanges(event){
        props.onChanges(updateNote);
        setUpdateNote({
            id: "",
            title: "",
            content: ""
        })
        event.preventDefault();
    }

    //to cancel any updates or changes made to a note
    //after that setting the update note state properties to empty strings for future operations usage
    function cancelChanges(){
        props.onCancel();
        setUpdateNote({
            id: "",
            title: "",
            content: ""
        })
    }
    return(
        <div className="updateArea">
            <h2>Update Note</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control  
                        name = "title"
                        value = {updateNote.title}
                        placeholder = "Update Title"
                        onChange = {handleChange}
                    />
                </Form.Group>
                <br />
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={5} 
                        name = "content"
                        value = {updateNote.content}
                        placeholder = "Update Content"
                        onChange = {handleChange}
                    />
                </Form.Group>
                <br />
                <br />
                <div className="updateBtn">
                    <Button className = "btnMargin" variant="primary" type="submit" onClick = {saveChanges}>
                        Save Changes
                    </Button>
                    <Button className = "btnMargin" variant="primary" type="reset" onClick = {cancelChanges}>
                        Cancel
                    </Button>
                </div>   
            </Form>
            {/* 
                <form>
                    <input
                        name = "title"
                        value = {updateNote.title}
                        placeholder = "Update Title"
                        onChange = {handleChange}
                    />
                    <br />
                    <br />
                    <textarea
                        name = "content"
                        value = {updateNote.content}
                        placeholder = "Update Content"
                        onChange = {handleChange}
                        rows= "5"
                    />
                    <br />
                    <br />
                    <div className="updateBtn">
                        <button type = "submit" onClick = {saveChanges}>Save Changes</button>
                        <button type = "reset" onClick = {cancelChanges}>Cancel</button>
                    </div>  
                </form>
            */}
            
        </div>
    );
}

export default UpdateArea