const express = require("express");
const path = require("path");
const fs = require('fs');
const { json } = require("express");

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
        let dataMsg;
        let recJsonData;

        jsonData.forEach((element, index, array) => {
            if (index == array.length - 1) {
                lastId = element.id;
                NextId = lastId + 1;
            }
        });

        if (newNote.length == undefined) {

            console.log("POST single object");
            dataMsg = getPostData(newNote);
        }
        else {
            
            console.log("POST multiple objects");
            newNote.forEach(element => dataMsg = getPostData(element));            
        }

        try
        {
            recJsonData = JSON.parse(dataMsg);
            fs.writeFile(dbNotes, recJsonData, (errWrite) => {
                if (errWrite) throw errWrite;
            });
            
            res.send(recJsonData);
        }
        catch
        {
            console.log("Variable is not a JSON object: ");
            console.log(dataMsg);
            res.send(dataMsg);
        }
        
        // fs.writeFile(dbNotes, dataWrite, (errWrite) => {
        //     if (errWrite) throw errWrite;
        // });

    });
});

function getPostData(noteData) {

    console.log("=== Inside get post data function ===");
    let allData = [];
    let errorMsg = "";

    //#region Checks if the data has "title" and "text" in the request body
        if (noteData.hasOwnProperty("title") && noteData.hasOwnProperty("text")) {
            allData.push({id : NextId++, title: noteData.title, text : noteData.text});
        }
        else {
            errorMsg = apiPostError();
        }
    //#endregion

    console.log("=== Ending get post data function ===");
    //#region Return data
        if (allData.length > 0) {
            return JSON.stringify(allData);
        }
        else {
            return errorMsg;
        }
    //#endregion

}

function apiPostError() {
    
    let generalMsgError = "Unable to add data due to incorrect/missing parameters:\nSingle object ~ { title: '..', text: '..' }\nMultiple objects ~ [ { title: '..', text: '..' }, { title: '..', text: '..' } ]";
    console.log(generalMsgError);

    return generalMsgError;
}

// Initialize-start Express instance
app.listen(port, () => console.log(`App listening on PORT ${port}`));