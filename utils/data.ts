async function fetchPostsWithUsers() {
  try {
    // Fetch posts and users concurrently
    const [postsResponse, usersResponse] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/posts"),
      fetch("https://jsonplaceholder.typicode.com/users"),
    ]);

    // Parse the responses as JSON
    const posts: Post[] = await postsResponse.json();
    const users: User[] = await usersResponse.json();

    // Map user data to the corresponding post
    const postsWithUsers = posts.map((post) => {
      const user = users.find((user) => user.id === post.userId);
      return {
        postTitle: post.title,
        userName: user ? user.name : "Unknown User",
      };
    });

    // Output the result
    console.log(postsWithUsers);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchPostsWithUsers();
