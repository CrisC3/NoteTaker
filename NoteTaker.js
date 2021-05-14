const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => console.log(`App listening on PORT ${port}`));