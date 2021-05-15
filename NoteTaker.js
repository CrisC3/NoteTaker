const express = require("express");
const path = require("path");
const fs = require('fs');

const webIndex = `${__dirname}/public/index.html`;
const webNotes = `${__dirname}/public/notes.html`;
const dbNotes = `${__dirname}/db/db.json`;

const app = express();
const port = process.env.PORT || 8080;

let NextId = "";
let allNotes;

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
    
    fs.readFile(dbNotes, "utf8", (errRead, dataRead) => {
        if (errRead) throw errRead;

        allNotes = JSON.parse(dataRead) || [];

        allNotes.forEach((element, index, array) => {
            if (index == array.length - 1) {
                lastId = element.id;
                NextId = lastId + 1;
            }
        });

        console.log("=== All existing notes ===");
        console.log(allNotes);
        console.log("=== New note(s) ===");
        console.log(newNote);
        console.log("===");
        console.log("Next ID is: " + NextId);

        if (newNote.length == undefined) {
            console.log("POST single object");
            getPostData(newNote);
        }
        else {
            
            console.log("POST multiple objects");
            newNote.forEach(element => getPostData(element));            
        }

        console.log("=== Line 63 ===");
        console.log(allNotes);

        fs.writeFile(dbNotes, JSON.stringify(allNotes, null, 4), (errWrite) => {
            if (errWrite) throw errWrite;
            console.log("Wrote data");
        });
        
    });
});

function getPostData(noteData) {

    console.log("=== Inside getPostData ===");
    let errorMsg = "";

    console.log(noteData)

    if (noteData.hasOwnProperty("title") && noteData.hasOwnProperty("text")) {
        allNotes.push({id : NextId++, title: noteData.title, text : noteData.text});
    }
    else {
        errorMsg = apiPostError(noteData);
    }
}

function apiPostError(noteData) {
    
    let generalMsgError = "Unable to add data due to incorrect/missing parameters:\nSingle object ~ { title: '..', text: '..' }\nMultiple objects ~ [ { title: '..', text: '..' }, { title: '..', text: '..' } ]\n\n";
    generalMsgError += JSON.stringify(noteData);
    console.log(generalMsgError);

    return generalMsgError;
}

// Initialize-start Express instance
app.listen(port, () => console.log(`App listening on PORT ${port}`));