import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const postsFilePath = path.join(__dirname, 'posts.json');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {res.render(__dirname + "/views/index.ejs")});
app.get("/home", (req, res) => {res.render(__dirname + "/views/index.ejs")});
app.get("/browse", (req, res) => {res.render(__dirname + "/views/browse.ejs")});
app.get("/newpost", (req, res) => {res.render(__dirname + "/views/newpost.ejs")});

app.post("/search", (req, res) => {
    res.render(__dirname + "/views/results.ejs")});

app.post("/submit", (req, res) => {
    req.body["date"] = getDate();
    console.log("Submitted data:", req.body);

    try {
        // Read existing posts from the JSON file
        const existingPosts = fs.readFileSync(postsFilePath, 'utf-8');
        const postsArray = JSON.parse(existingPosts);
    
        // Generate a new ID for the submitted post
        const lastId = postsArray.length > 0 ? postsArray[postsArray.length - 1].id : 0;
        const newId = lastId + 1;
    
        // Create a new post object with the generated ID
        const newPost = {
          id: newId,
          date: req.body.date,
          title: req.body.title,
          content: req.body.content,
          author: req.body.author,
          email: req.body.email ? req.body.email : 'none',
          editable: req.body.editable ? req.body.editable : 'off',
          views: 0
        };
    
        // Add the new post to the array
        postsArray.push(newPost);
    
        // Write the updated array back to the JSON file
        fs.writeFileSync(postsFilePath, JSON.stringify(postsArray, null, 2));
    
        res.render(__dirname + "/views/newpost.ejs", {submittedText: "Post submitted"});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.listen(port, () => console.log(`App listening on port ${port}.`));


function getDate() {
    const isoString = new Date().toISOString();
    const dateObject = new Date(isoString);
  
    const year = dateObject.getFullYear();
    const month = `0${dateObject.getMonth() + 1}`.slice(-2); // Adding leading zero if needed
    const day = `0${dateObject.getDate()}`.slice(-2); // Adding leading zero if needed
    const hours = `0${dateObject.getHours()}`.slice(-2); // Adding leading zero if needed
    const minutes = `0${dateObject.getMinutes()}`.slice(-2); // Adding leading zero if needed
  
    return `${year}-${month}-${day}-${hours}-${minutes}`;
}

