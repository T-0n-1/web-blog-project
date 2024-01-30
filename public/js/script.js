async function deletePost(id) {
  const postId = id;
  const userDecision = confirm('Do you want to delete post?');
    if (userDecision) {
      // User clicked OK
      try {
        const response = await fetch(`/deletePost/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (result.success) {
          // Handle success (post deleted)
          console.log('Post deleted successfully.');
          // You may want to reload the page or update the UI here
          // Reload the current page
          location.reload();
        } else {
          // Handle failure (post not found or other error)
          console.error(`Error: ${result.error}`);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
      } 
    } 
}

document.addEventListener('DOMContentLoaded', function () {
  const postTitles = document.querySelectorAll('[data-bs-toggle="modal"]');
  
  postTitles.forEach(title => {
    title.addEventListener('click', async function () {
      const postId = this.getAttribute('data-post-id');

      try {
        // Send a request to the server to increment the views count in the JSON file
        const response = await fetch(`/updateViews/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to increment views: ${response.statusText}`);
        }
      } catch (error) {
        console.error(error);
        // Handle errors as needed
      }
    });
  });
});

function editPost(postId) {
  const editContent = document.getElementById(`editContent${postId}`).value;
  const editAuthor = document.getElementById(`editAuthor${postId}`).value;
  const editCheckbox = document.getElementById(`editCheckbox${postId}`).checked;

  // Make a fetch request to your server to update the post
  fetch(`/editPost/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: editContent,
      author: editAuthor,
      editable: editCheckbox ? 'on' : 'off',
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to edit post: ${response.statusText}`);
    }
    // Optionally, you can reload the page or update the post content dynamically
    location.reload(); // Reload the page for simplicity
  })
  .catch(error => {
    console.error(error);
    // Handle errors as needed
  });
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const userInput = document.getElementById('searchInput').value;
  // Send the input to the server using fetch
  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    // Handle the data on the client side
    console.log(data);
    // You can update the DOM or perform other actions here
  })
  .catch(error => console.error(error));
});