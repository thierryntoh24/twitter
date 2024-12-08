"use client";

import { useState } from "react";
import NewsItem from "./news-item";
import { Trending } from "@/lib/types";
import { fetchTrending } from "@/lib/data";

export default function NewsComponent({
  initialData,
}: {
  initialData: Trending[];
}) {
  const [data, setData] = useState(initialData);
  const [start, setStart] = useState(initialData.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false); // Track if expanded or collapsed

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchTrending(start, start + 2);
      setData((prev) => [...prev, ...result]);
      setStart((prev) => prev + result.length);
      setHasMore(result.length > 0); // Check if there are more items to load
      setExpanded(true); // Indicate that the list is expanded
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setLoading(false);
    }
  };

  const seeLess = () => {
    // Reset the list back to the initial state
    setData(initialData);
    setStart(initialData.length);
    setHasMore(true);
    setExpanded(false); // Indicate that the list is collapsed
  };

  return (
    <div className="border border-gray-200 rounded-xl flex-col hidden xl:flex mx-4 overflow-hidden h-fit">
      <span className="py-2 px-4 text-base font-semibold">
        What’s happening
      </span>

      <ul>
        {data.map((trend) => (
          <NewsItem key={trend.id} trend={trend} />
        ))}
      </ul>

      <div className="flex w-full">
        {/* Show 'Load More' button if collapsed */}
        {!expanded && hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            className="load-more-btn text-blue-500 hover:bg-gray-100 transition-colors p-4 text-left"
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        )}

        {/* Show 'See Less' button if expanded */}
        {expanded && (
          <button
            onClick={seeLess}
            className="see-less-btn text-red-500 hover:bg-gray-100 transition-colors p-4 text-left"
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
