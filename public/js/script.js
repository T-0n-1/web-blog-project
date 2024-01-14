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