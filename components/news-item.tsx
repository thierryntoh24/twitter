import { Trending } from "@/lib/types";
import { formatTweetCount } from "@/utils/utils";

interface ItemProps {
  phrase: String;
  userName: String;
}

export default function NewsItem({ trend }: { trend: Trending }) {
  return (
    <li className="flex flex-col px-4 py-2 hover:bg-gray-100 transition-colors gap-1 cursor-pointer">
      <span className=" text-gray-600 text-xs">{`${trend.category} · ${trend.location}`}</span>
      <span className="font-medium">{`${trend.topic}`}</span>
      <span className=" text-gray-600 text-xs">
        {`${formatTweetCount(trend.tweet_count)} posts`}
      </span>
    </li>
  );
}
