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
});

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