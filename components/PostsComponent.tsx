"use client";

import { fetchPosts } from "@/utils/data";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { Post } from "@/utils/types";
import { supabase } from "@/utils/context/AuthContext";

export default function PostsComponent({
  initialPosts,
}: {
  initialPosts: Post[] | null;
}) {
  if (!initialPosts) return;

  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    const changes = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Listen only to INSERTs
          schema: "public",
          table: "posts",
        },
        (payload) => {
          setPosts((prevPosts: Post[]) => [payload.new as Post, ...prevPosts]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changes);
    };
  }, [supabase]);

  return (
    <div>
      {posts?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
