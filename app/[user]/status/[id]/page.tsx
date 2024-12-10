import NavBar from "@/components/navbar";
import { fetchSinglePost } from "@/utils/data";

export default async function PostPage({
  params,
}: {
  params: Promise<{ user: string; id: string }>;
}) {
  const user_id = (await params).user;
  const post_id = (await params).id;

  let post = await fetchSinglePost(post_id);

  if (!post) return;

  return (
    <>
      <NavBar title={"Post"} back url="/" />
      <div className="px-6 py-4 w-full flex flex-col gap-3 align-top border-b border-gray-200 hover:bg-gray-200">
        <div className="flex gap-1.5 flex-col">
          <img
            src={post.user_object.avatar_url} // Use user's avatar or fallback image
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-medium">{post.user_object.name}</span>
        </div>

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
    </>
  );
}
