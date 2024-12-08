"use client";
import { useAuth } from "@/utils/context/AuthContext";

export default function PageContent() {
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  const { user, signOut } = useAuth();

  if (user)
    return (
      <div className=" flex justify-center items-center flex-col w-full py-14 gap-8">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.user_metadata.full_name}
          </span>
          <span className="text-xs text-gray-500">
            @{user.user_metadata.email}
          </span>
        </div>

        <button
          onClick={signOut}
          className=" bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 w-48 py-3 hidden xl:block"
        >
          Sign out
        </button>
      </div>
    );

  return (
    <div className=" flex w-full py-24 align-middle justify-center items-center">
      Nothing to see here...
    </div>
  );
}
