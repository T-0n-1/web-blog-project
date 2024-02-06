// Imports
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs/promises'; // Use fs.promises for async file operations
import path from 'path';

// Constants
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const postsFilePath = path.join(__dirname, 'posts.json');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// View engine setup
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render(path.join(__dirname, 'views/index.ejs')));
app.get('/home', (req, res) => res.render(path.join(__dirname, 'views/index.ejs')));
app.get('/newpost', (req, res) => res.render(path.join(__dirname, 'views/newpost.ejs')));
app.get('/search', (req, res) => res.render('results.ejs', { results: [] })); // Pass an empty array initially

// Route for browsing posts
app.get('/browse', async (req, res) => {
  try {
    // Use fs.promises.readFile for async file reading
    const postsData = await fs.readFile(postsFilePath, 'utf-8');
    const postsArray = JSON.parse(postsData);
    // Extract id, date, and title from each post
    const postsList = postsArray.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        date: post.date,
        time: post.time,
        author: post.author,
        email: post.email,
        editable: post.editable,
        views: post.views,
    }));
    res.render(path.join(__dirname, 'views/browse.ejs'), { postsList });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for getting post content by ID
app.get('/getPostContent/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const postsData = await fs.readFile(postsFilePath, 'utf-8');
    const postsArray = JSON.parse(postsData);
    // Find the post by ID
    const selectedPost = postsArray.find(post => post.id === postId);
    if (selectedPost) {
      // You can customize this to extract the content you want to send to the client
      const postContent = {
        id: selectedPost.id,
        title: selectedPost.title,
        content: selectedPost.content,
        author: selectedPost.author,
        date: selectedPost.date,
        time: selectedPost.time,
        email: selectedPost.email,
        editable: selectedPost.editable,
        views: selectedPost.views
        // Add more fields as needed
      };
      res.json(postContent);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for searching posts
app.post('/search', async (req, res) => {
  try {
    let userInput = req.body.userInput;
    // Extract year month and searchWords from the userInput
    const regexPattern = /[\s,]+/;
    const splittedUserInput = userInput.split(regexPattern)
                        .filter(word => word.trim() !== '')
                        .map(word => word.toLowerCase());
    const searchWords = splittedUserInput.filter(word => !word.includes('::'));
    const searchDate = splittedUserInput.find(word => word.includes('::'));
    let year;
    let month;
    if (searchDate) {
      const [yearStr, monthStr] = searchDate.split('::');
      if (yearStr.length > 0) year = parseInt(yearStr); 
      if (monthStr.length > 0) month = monthStr.padStart(2, '0');
    }
    // Read posts from JSON file
    const postsData = await fs.readFile(postsFilePath, 'utf-8');
    const postsArray = JSON.parse(postsData);
    // Filter posts based on year and/or month
    let filteredPosts = postsArray;
    if (year && month) {
      // Filter by both year and month
      filteredPosts = filteredPosts.filter(post => {
        const [postDay, postMonth, postYear] = (post.date).split('.');
        return parseInt(postYear) == year && parseInt(postMonth) == month;
      });
    } else if (year) {
      // Filter by year only
      filteredPosts = filteredPosts.filter(post => {
        const [postDay, postMonth, postYear] = (post.date).split('.');
        return postYear == year;
      });
    } else if (month) {
      // Filter by month only
      filteredPosts = filteredPosts.filter(post => {
        const [postDay, postMonth, postYear] = (post.date).split('.');
        return postMonth == month;
      });
    }
    // Calculate hits per post for partial matches
    const postsList = filteredPosts.map(post => {
      const words = []
        .concat(post.title.split(regexPattern)
          .filter(word => word.trim() !== '')
          .map(word => word.toLowerCase()))
        .concat(post.content.split(regexPattern)
          .filter(word => word.trim() !== '')
          .map(word => word.toLowerCase()))
        .concat(post.author.split(regexPattern)
          .filter(word => word.trim() !== '')
          .map(word => word.toLowerCase()));
      const hits = [];
      const misses = searchWords.filter(searchTerm => {
        const found = words.some(word => word.includes(searchTerm));
        if (found) {
          hits.push(searchTerm);
        }
        return !found;
      });
      const noDuplicateHits = [...new Set(hits)];
      return {
        id: post.id,
        title: post.title,
        hits: noDuplicateHits,
        hitsCount: hits.length,
        misses: misses,
        missesCount: misses.length,
        content: post.content,
        date: post.date,
        time: post.time,
        author: post.author,
        email: post.email,
        editable: post.editable,
        views: post.views,
      };
    });
    // Sort results by the number of hits (descending order)
    postsList.sort((a, b) => b.hitsCount - a.hitsCount);
    res.render(path.join(__dirname, 'views/results.ejs'), { postsList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route for submitting a new post
app.post('/submit', async (req, res) => {
  req.body.date = getDate();
  try {
    // Read existing posts from the JSON file
    const existingPosts = await fs.readFile(postsFilePath, 'utf-8');
    const postsArray = JSON.parse(existingPosts);
    // Generate a new ID for the submitted post
    const lastId = postsArray.length > 0 ? postsArray[postsArray.length - 1].id : 0;
    const newId = lastId + 1;
    // Create a new post object with the generated ID
    const dateComponents = req.body.date.split('-');
    const newPost = {
      id: newId,
      date: dateComponents.slice(0, 3).reverse().join('.'),
      time: dateComponents.slice(3).join(':'),
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      email: req.body.email ? req.body.email : 'none',
      editable: req.body.editable ? req.body.editable : 'off',
      views: 0,
    };
    // Add the new post to the array
    postsArray.push(newPost);
    // Write the updated array back to the JSON file
    await fs.writeFile(postsFilePath, JSON.stringify(postsArray, null, 2));
    res.render(path.join(__dirname, 'views/newpost.ejs'), { submittedText: 'Post submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for deleting a post
app.delete('/deletePost/:id', async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
      // Read existing posts from the JSON file
      const postsData = await fs.readFile(postsFilePath, 'utf-8');
      const postsArray = JSON.parse(postsData);
      // Filter out the post by ID
      const updatedPostsArray = postsArray.filter(post => post.id !== postId);
      // Check if any post was removed
      if (updatedPostsArray.length < postsArray.length) {
        // Write the updated array back to the JSON file
        await fs.writeFile(postsFilePath, JSON.stringify(updatedPostsArray, null, 2));
        // Send a success response
        res.json({ success: true });
      } else {
        // Send a failure response if the post is not found
        res.status(404).json({ success: false, error: 'Post not found' });
      }
    } catch (error) {
      console.error(error);
      // Send a failure response for any other errors
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

// Route for updating the views count
app.put('/updateViews/:id', async (req, res) => {
    const postId = parseInt(req.params.id);
    try {
      const postsData = await fs.readFile(postsFilePath, 'utf-8');
      const postsArray = JSON.parse(postsData);
      // Find the post by ID
      const selectedPost = postsArray.find(post => post.id === postId);
      if (selectedPost) {
        // Update the views count
        selectedPost.views += 1;
        // Write the updated array back to the JSON file
        await fs.writeFile(postsFilePath, JSON.stringify(postsArray, null, 2));
        res.sendStatus(200);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route for editing a post
app.put('/editPost/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  const { content, author, editable } = req.body;
  try {
    const postsData = await fs.readFile(postsFilePath, 'utf-8');
    const postsArray = JSON.parse(postsData);
    const editedPostIndex = postsArray.findIndex(post => post.id === postId);
    if (editedPostIndex !== -1) {
      // Update the post data
      postsArray[editedPostIndex].content = content;
      postsArray[editedPostIndex].author = `${postsArray[editedPostIndex].author} (edited by ${author})`;
      postsArray[editedPostIndex].editable = editable;
      // Write the updated array back to the JSON file
      await fs.writeFile(postsFilePath, JSON.stringify(postsArray, null, 2));
      res.status(200).json({ message: 'Post edited successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => console.log(`App listening on port ${port}.`));

/**
 * 
 * @returns {string} - A formatted date string
 
 */
function getDate() {
  const isoString = new Date().toISOString();
  const dateObject = new Date(isoString);
  const year = dateObject.getFullYear();
  const month = `0${dateObject.getMonth() + 1}`.slice(-2);
  const day = `0${dateObject.getDate()}`.slice(-2);
  const hours = `0${dateObject.getHours()}`.slice(-2);
  const minutes = `0${dateObject.getMinutes()}`.slice(-2);
  return `${year}-${month}-${day}-${hours}-${minutes}`;
}