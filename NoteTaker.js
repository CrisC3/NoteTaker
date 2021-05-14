const express = require("express");
const indexPage = `${__dirname}/public/index.html`;
const notesPage = `${__dirname}/public/notes.html`;

const app = express();
const port = process.env.PORT || 8080;

// Require for POST, both the ".use"
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes - GET - for index.html and notes.html pages
app.get("/", (req, res) => res.sendFile(indexPage));
app.get("/notes", (req, res) => res.sendFile(notesPage));

// Initialize-start Express instance
app.listen(port, () => console.log(`App listening on PORT ${port}`));