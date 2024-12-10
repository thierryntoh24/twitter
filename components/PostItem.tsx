import { Post } from "@/utils/types";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import React from "react";

export default function PostItem({ post }: { post: Post }) {
  return (
    <Link
      href={`/${post.user_object.email}/status/${post.id}`}
      className="px-6 py-4 w-full flex gap-4 align-top border-b border-gray-200 hover:bg-gray-200"
    >
      <img
        src={post.user_object.avatar_url} // Use user's avatar or fallback image
        alt="User Avatar"
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="flex gap-1.5 flex-col">
        <span className="font-medium">{post.user_object.name}</span>
        <div className="flex gap-1.5 flex-col">
          {post.content && <span>{post.content}</span>}
          {post.image && (
            //https://qugkdriqqqgdetfrttlh.supabase.co/storage/v1/object/public/post-photos/6fa887c5-6c5c-48e6-8aee-27d70213e74c/hero-desktop.webp
            <img
              src={`${process.env
                .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/post-photos/${
                post.image
              }`}
              alt="Post image"
              className="w-full h-auto max-h-60 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </Link>
  );
}
