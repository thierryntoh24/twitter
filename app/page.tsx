import { useAuth } from "@/utils/context/AuthContext";
import React, { Suspense } from "react";
import PageContent from "./pagecontent";
import PostCompose from "@/components/ComposeComponent";
import NavBar from "@/components/navbar";
import PostsComponent from "@/components/PostsComponent";
import { fetchPosts } from "@/utils/data";

export default async function Home() {
  const posts = await fetchPosts(); // Fetch user from Supabase or cookies (server-side).

  return (
    <section>
      <NavBar title={"Home"} />
      <div className="">
        <PostCompose />
      </div>

      <Suspense
        fallback={
          <div className=" flex w-full py-24 align-middle justify-center items-center">
            Loading...
          </div>
        }
      >
        <PostsComponent initialPosts={posts} />
      </Suspense>
    </section>
  );
}
