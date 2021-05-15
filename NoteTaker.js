const express = require("express");
const path = require("path");
const fs = require('fs');

const webIndex = `${__dirname}/public/index.html`;
const webNotes = `${__dirname}/public/notes.html`;
const dbNotes = `${__dirname}/db/db.json`;

const app = express();
const port = process.env.PORT || 8080;

let NextId = "";

app.use("/static", express.static("public/assets"));

// Require for POST, both the ".use"
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes - GET - for index.html and notes.html pages
app.get("/", (req, res) => res.sendFile(webIndex));
app.get("/notes", (req, res) => res.sendFile(webNotes));

app.get("/api/notes", (req, res) => {
    res.sendFile(dbNotes);
});

app.post("/api/notes", (req, res) => {
    
    const newNote = req.body;

    console.log("=================");
    console.log("request body");
    console.log(newNote);
    console.log("newNote length = " + newNote.length);
    console.log("=================");
    
    fs.readFile(dbNotes, "utf8", (errRead, dataRead) => {
        if (errRead) throw errRead;

        let jsonData = JSON.parse(dataRead);

        jsonData.forEach((element, index, array) => {
            if (index == array.length - 1) {
                lastId = element.id;
                NextId = lastId + 1;
            }
        });

        if (newNote.length == undefined) {

            if (newNote.hasOwnProperty("title") && newNote.hasOwnProperty("text"))
                jsonData.push({id : NextId, title: newNote.title, text : newNote.text});
            else {
                let message = apiPostError();
                res.send(message);
            }
        }
        else {
            
            newNote.forEach(element => {
                
                console.log("=================");
                console.log("Individual element");
                console.log(`title: ${element.title}, text : ${element.text}`);
                console.log("=================");

                if (element.hasOwnProperty("title") && element.hasOwnProperty("text")) {
                
                    jsonData.push({id : NextId++, title: element.title, text : element.text});
                    console.log(lastId);
                }
                else {
                    let message = apiPostError();
                    res.send(message);
                }
            });

            
        }
        
        console.log("Line 82");
        console.log(jsonData);

        // fs.writeFile(dbNotes, dataWrite, (errWrite) => {
        //     if (errWrite) throw errWrite;
        // });

    });
});

function apiPostError() {
    
    let generalMsgError = "Unable to add data due to incorrect/missing keys { title: '...', text: '...' }";
    console.log(generalMsgError);

    return generalMsgError;
}

function getNextId() {

    let lastId;

    fs.readFile(dbNotes, "utf8", (err, data) => {
        if (err) throw err;

        let jsonData = JSON.parse(data);

        jsonData.forEach((element, index, array) => {
            if (index == (array.length - 1))
                lastId = element.id;
        });

        NextId = ++lastId;

    });
}

// Initialize-start Express instance
app.listen(port, () => console.log(`App listening on PORT ${port}`));