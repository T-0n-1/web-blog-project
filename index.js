import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));

app.get("/", (req, res) => {res.render(__dirname + "/views/index.ejs")});
app.get("/home", (req, res) => {res.render(__dirname + "/views/index.ejs")});
app.get("/browse", (req, res) => {res.render(__dirname + "/views/browse.ejs")});
app.get("/newpost", (req, res) => {res.render(__dirname + "/views/newpost.ejs")});

app.listen(port, () => console.log(`App listening on port ${port}.`));