import { useAuth } from "@/utils/context/AuthContext";
import React, { Suspense } from "react";
import PageContent from "./pagecontent";
import PostCompose from "@/components/ComposeComponent";
import NavBar from "@/components/navbar";
import PostsComponent from "@/components/PostsComponent";

export default function Home() {
  return (
    <section>
      <NavBar title={"Home"} />
      <div className="">
        <PostCompose />
      </div>

      <PostsComponent />

      {/* <Suspense
        fallback={
          <div className=" flex w-full py-24 align-middle justify-center items-center">
            Loading...
          </div>
        }
      >
        <PageContent />
      </Suspense> */}
    </section>
  );
}
