import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const app = express();

//middle-ware for passing data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//creating an object with required values to work with db
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//connect to the database
db.connect();

//By default React.js runs on port 3000
//So we use the port 5000 for running Node.js
const port = 5000;

//to store the current session user name
var sessionUser = "";

//to store the number of salt rounds for encryption through bcrypt
const saltRounds = 10;

//post method for endpoint "/register"
app.post("/register", async(req, res) => { 
    const {userName, email, password, userType} = req.body;
    try{
        const entityCheck = db.query("SELECT * FROM users WHERE email = ($1)",
            [email]
        );
        //400
        if((await entityCheck).rows.length > 0){
            res.json({error: "User already exists"});
        }
        else{
            bcrypt.hash(password, saltRounds, async(error, hash) => {
                //500
                if(error){
                    res.json({error: "An error occured"});
                }
                else{
                    console.log(userType);
                    await db.query("INSERT INTO users (username, email, password, usertype) VALUES ($1, $2, $3, $4)", 
                        [userName, email, hash, userType]
                    );
                }
            })    
        }
    }
    //500 return 
    catch(error){
        console.log(error);
    }
})

//post method for endpoint "/login"
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const result = await db.query("SELECT username, password, usertype FROM users WHERE email = ($1)",
            [email]
        );
        if(result.rows.length > 0){
            const storedHashedPassword = result.rows[0].password;
            bcrypt.compare(password, storedHashedPassword, async(error, reslt) => {
                if(error){
                        console.log("Error in login");
                }
                else{
                    //generate jwt token and send back
                    if(reslt){
                        res.json({userType: result.rows[0].usertype, userName: result.rows[0].username});   
                    }
                    else{
                        res.status(401).json({message: 'Invalid Email or Password'});
                        console.log("No user found...!");
                    }            
                }
            });
        }
        else{
            res.status(401).json({message: 'Invalid Email or Password'});
            console.log("No user found...!");
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

// get method for endpoint "/users"
// sends the response as json response
// gets all the usernames from the users table
app.get("/users", async(req, res) => {
    try{
        const queryResult = await db.query("SELECT username FROM users ORDER BY username");
        var result = queryResult.rows;
    }
    catch(error){
        console.log(`Error: ${error}`)
    }
    res.json({users: result});
})

// get method for endpoint "/api" 
// sends the response as json format
app.post("/api", async (req, res) => {
    sessionUser = req.body.userName;
    try{
        const queryResult = await db.query("SELECT * FROM note WHERE username = ($1) ORDER BY id ASC",
            [sessionUser]
        )
        var result = queryResult.rows;
    } catch(error){
        console.log(error);
    }
    res.json({notes: result});
});

//to add a new note 
//obtained title and content from the client
//INSERTed the same into the note table
app.post("/add", async (req, res) => {
    const { title, content } = req.body;
    try{
        await db.query("INSERT INTO note (title, content, username) VALUES ($1, $2, $3)",
            [title, content, sessionUser]
        );
        res.status(200).send("Note received"); // Send a response to acknowledge the request
        //res.redirect("/api");
    } catch(error){
        console.log(error);
    }
  });

  //to update an existing note
  //obtained id, title and content from the client side
  //it involves checking which field is updated
  //then updating only that field
  //applicable when both fields are updated also
  app.put("/update", async (req, res) => {
    const {id, title, content} = req.body;
    try{     
        const queryResult = await db.query("SELECT * FROM note WHERE id = ($1)", [id]);
        const checkResult = queryResult.rows;
        if(title != (checkResult[0].title)){
            if(content != (checkResult[0].content)){
                await db.query("UPDATE note SET title = ($1), content = ($2) WHERE id = ($3)",
                    [title, content, id]
                );
            }
            else if(content == (checkResult[0].content)){
                await db.query("UPDATE note SET title = ($1) WHERE id = ($2)",
                    [title, id]
                )
            }
        }
        else{
            if(content != (checkResult[0].content)){
                await db.query("UPDATE note SET content = ($1) WHERE id = ($2)",
                    [content, id]
                );
            }
        }
    }
    catch(error){
        console.log(error);
    }
  })

  //to delete an existing note
  //obtained id from the client
  //DELETEed the respective record using WHERE clause
  app.post("/delete", async (req, res) => {
    try{
        const id = req.body.id;
        await db.query("DELETE FROM note WHERE id = ($1)",
            [id]
        );
        //res.sendStatus(200).send("ID Received.");
    }
    catch(error){
        console.log(error);
    }  
  })

/*
app.post("/add", (req, res) => {

    console.log(req.body.title);
    res.redirect("/api");
})
*/

//to start the server from the specified port
app.listen(port, () => {
    console.log(`Server working on Port ${port}`);
})