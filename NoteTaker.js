const express = require("express");
const path = require("path");
const fs = require("fs");

const webIndex = `${__dirname}/public/index.html`;
const webNotes = `${__dirname}/public/notes.html`;
const dbNotes = `${__dirname}/db/db.json`;

const app = express();
const port = process.env.PORT || 8080;

let NextId = "";
let allNotes = [];

// Use to load static files like CSS, JS files
app.use("/static", express.static("public/assets"));

// Require for POST, both the ".use"
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes - GET - for index.html and notes.html pages
app.get("/", (req, res) => res.sendFile(webIndex));
app.get("/notes", (req, res) => res.sendFile(webNotes));

// API Route - GET - all notes from the db.json file and displays in the web page
app.get("/api/notes", (req, res) => {
    res.sendFile(dbNotes);
});

// API Route - POST - adds notes to the db.json file
app.post("/api/notes", (req, res) => {
    
    const newNote = req.body;
    
    // Reads the db.json file
    fs.readFile(dbNotes, "utf8", (errRead, dataRead) => {
        if (errRead) throw errRead;

        // Parses the file data as JSON and store it in variable
        allNotes = JSON.parse(dataRead);

        // Loops thru the data in the JSON, to find the last ID set,
        // and assigns the next id by plus 1
        allNotes.forEach((element, index, array) => {
            if (index == array.length - 1) {
                lastId = element.id;
                NextId = lastId + 1;
            }
        });

        // Checks if the api post have is only curly braces {}, no brackets []
        if (newNote.length == undefined) {
            
            // Calls the getPostData function, with the data parameter
            // for a single data object
            getPostData(newNote);
        }
        else {
            
            // Calls the getPostData function, with the data parameter
            // for a multiple data objects
            newNote.forEach(element => getPostData(element));
        }

        // Calls the function to save data into the db.json file
        saveToFile();

        // Resolves to the browser with the new note data
        res.send(newNote);
        
    });
});

// API Route - DELETE - deletes notes from the db.json file
app.delete("/api/notes/:id", (req, res) => {

    // Loops the all notes variable
    allNotes.forEach((element, index, array) => {
        
        // Checks if the params id value matches the element id
        if (element.id == req.params.id) {
            
            // Splice the all note array by index
            array.splice(index, 1);
        }
    });

    // Calls the function to save data into the db.json file
    saveToFile();

});

// Function to read the db.json file
function readFromFile() {

    const defaultData = [
        {title: "Welcome", text : "Write yourself a note"},
        {title: "My Note", text : "You can type more information here"}
    ];

    // Reads the db.json file content
    fs.readFile(dbNotes, "utf8", (errRead, dataRead) => {
        if (errRead) throw errRead;

        // Assigns the data read and parses as JSON into all notes variable
        allNotes = JSON.parse(dataRead);

        // if (allNotes.length == 0) {
        //     defaultData.forEach(element => getPostData(element));
        //     saveToFile();
        // }
    });
}


// Function to write the allnotes into the db.json file
function saveToFile() {

    // Write to file call
    fs.writeFile(dbNotes, JSON.stringify(allNotes, null, 4), (errWrite) => {
        if (errWrite) throw errWrite;
    });
}

// Function for POST, to add data into the variable all notes
function getPostData(noteData) {

    let errorMsg = "";

    // Checks if the POST notes has title and text properties, for validation
    if (noteData.hasOwnProperty("title") && noteData.hasOwnProperty("text")) {
        allNotes.push({id : NextId++, title: noteData.title, text : noteData.text});
    }
    else {
        // Generates error message by calling apiPostError function
        errorMsg = apiPostError(noteData);
    }
}

// Function with generic error message, if POST fails
function apiPostError(noteData) {
    
    let generalMsgError = "Unable to add data due to incorrect/missing parameters:\nSingle object ~ { title: '..', text: '..' }\nMultiple objects ~ [ { title: '..', text: '..' }, { title: '..', text: '..' } ]\n\n";
    generalMsgError += JSON.stringify(noteData);

    return generalMsgError;
}

// Initialize-start Express instance
app.listen(port, () => {
    console.log(`App listening on PORT ${port}`);

    // Reads from file after initiating
    readFromFile();
});