"use client";

import { useState } from "react";
import NewsItem from "./news-item";

export default function NewsComponent({
  initialData,
}: {
  initialData: User[];
}) {
  const [data, setData] = useState(initialData);
  const [start, setStart] = useState(initialData.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=3`
      );
      const result: User[] = await res.json();
      setData((prev) => [...prev, ...result]);
      setStart((prev) => prev + result.length);
      setHasMore(false);
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl flex-col hidden xl:flex mx-4">
      <span className="py-2 px-4 text-base font-semibold">
        What’s happening
      </span>

      <ul>
        {data.map((user, index) => (
          <NewsItem
            key={index}
            phrase={`${user.company.catchPhrase} ${user.company.bs}`}
            userName={user.name}
          />
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="load-more-btn text-blue-500 hover:bg-gray-100 transition-colors p-4 text-left"
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      )}
    </div>
  );
}
