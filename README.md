# Web Blog Post

Web Blog Post is a simple web application for reading, writing, editing, and deleting blog posts. Built using Node.js and Express, this application offers the following features:

## Table of Contents

- [Web Blog Post](#web-blog-post)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Key Features](#key-features)
  - [Technologies Used](#technologies-used)
  - [Author](#author)

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and go to [http://localhost:3000](http://localhost:3000)

Feel free to explore and contribute to the project!

## Key Features

1. **Create New Posts:** Users can easily create new blog posts by providing a title, content, author name, and optional email address.

2. **Browse Existing Posts:** Browse through a list of existing blog posts, displaying essential information such as title, author, date, and views.

3. **View Post Content:** Clicking on a post title reveals the full content of the post in a modal, providing an immersive reading experience.

4. **Search Functionality:** Users can search for specific words or topics within the posts. Users can also use year and/or month to search posts or narrow search made with search word(s). The application performs partial matching on titles, content, and author names.

5. **Edit Existing Posts:** If enabled during post creation, users can edit the content of their posts, updating the text and indicating the edit in the author's name.

6. **Delete Posts:** Users have the ability to delete their posts, removing them from the application.

7. **Views Count:** The application tracks and displays the number of views for each post.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **Express:** Web application framework for Node.js.
- **EJS (Embedded JavaScript):** View engine for rendering dynamic HTML templates.
- **Bootstrap:** Front-end framework for styling and layout.
- **JSON File Storage:** Asynchronous file operations using `fs/promises` to read and write post data.

## Author

ToniM
- LinkedIn: [Toni Mertanen](https://www.linkedin.com/in/toni-mertanen/)
- GitHub: [T-0n-1](https://github.com/T-0n-1)