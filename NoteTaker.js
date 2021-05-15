const express = require("express");
const path = require("path");
const fs = require('fs');

const webIndex = `${__dirname}/public/index.html`;
const webNotes = `${__dirname}/public/notes.html`;
const dbNotes = `${__dirname}/db/db.json`;

const app = express();
const port = process.env.PORT || 8080;

let NextId = "";
let allNotes = [];

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

        allNotes = JSON.parse(dataRead);

        allNotes.forEach((element, index, array) => {
            if (index == array.length - 1) {
                lastId = element.id;
                NextId = lastId + 1;
            }
        });

        if (newNote.length == undefined) {
            
            getPostData(newNote);
        }
        else {
            
            newNote.forEach(element => getPostData(element));
        }

        saveToFile();

        res.send(newNote);
        
    });
});

app.delete("/api/notes/:id", (req, res) => {

    let custom = req.params.id;
    
    console.log("Request params id = "+ custom);
    // allNotes.splice(req.params.id, 1);

    allNotes.forEach((element, index, array) => {
        
        if (element.id == req.params.id) {
            
            array.splice(index, 1);
        }
    });

    saveToFile();

});

function readFromFile() {

    const defaultData = [
        {title: "Welcome", text : "Write yourself a note"},
        {title: "My Note", text : "You can type more information here"}
    ];

    fs.readFile(dbNotes, "utf8", (errRead, dataRead) => {
        if (errRead) throw errRead;
        allNotes = JSON.parse(dataRead);

        console.log(allNotes.length)

        // if (allNotes.length == 0) {
        //     defaultData.forEach(element => getPostData(element));
        //     saveToFile();
        // }
    });
}

function saveToFile() {

    fs.writeFile(dbNotes, JSON.stringify(allNotes, null, 4), (errWrite) => {
        if (errWrite) throw errWrite;
    });
}

function getPostData(noteData) {

    console.log(noteData);

    let errorMsg = "";

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

    return generalMsgError;
}

// Initialize-start Express instance
app.listen(port, () => {
    console.log(`App listening on PORT ${port}`)
    readFromFile();
});