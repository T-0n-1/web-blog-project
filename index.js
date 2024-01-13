import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {res.render(__dirname + "/views/index.ejs")});
app.get("/home", (req, res) => {res.render(__dirname + "/views/index.ejs")});
app.get("/browse", (req, res) => {res.render(__dirname + "/views/browse.ejs")});
app.get("/newpost", (req, res) => {res.render(__dirname + "/views/newpost.ejs")});

app.post("/search", (req, res) => {
    res.render(__dirname + "/views/results.ejs")});

app.post("/submit", (req, res) => {
    console.log("Submitted data:", req.body);
    res.render(__dirname + "/views/newpost.ejs", {submittedText: "Post submitted"});
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
