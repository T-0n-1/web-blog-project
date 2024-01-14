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