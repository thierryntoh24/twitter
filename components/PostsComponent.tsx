import { fetchPosts } from "@/utils/data";
import React from "react";
import PostItem from "./PostItem";

export default async function PostsComponent() {
  const posts = await fetchPosts(); // Fetch user from Supabase or cookies (server-side).

  return (
    <div>
      {posts?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
