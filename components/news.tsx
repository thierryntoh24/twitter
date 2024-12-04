import React from "react";
import NewsComponent from "./news-component";

export default function News() {
  return (
    <div className="news-wrapper">
      <div className=" pt-2 pb-4 lg:flex flex-col hidden gap-2 h-screen border-l w-[18rem]">
        <div className="search sticky px-4 py-2 top-0">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 border-gray-200 border rounded-3xl text-sm w-full px-4 py-2"
          />
        </div>
        <NewsWrapper />
      </div>
    </div>
  );
}

async function NewsWrapper() {
  // Fetch initial data on the server
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users?_limit=3`,
    {
      cache: "no-store", // Ensure fresh data
    }
  );
  const initialData: User[] = await res.json();

  // console.log(initialData);

  return <NewsComponent initialData={initialData} />;
}
