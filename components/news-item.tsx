import React from "react";

interface ItemProps {
  phrase: String;
  userName: String;
}

export default function NewsItem({ phrase, userName }: ItemProps) {
  return (
    <li className="flex flex-col px-4 py-2 hover:bg-gray-100 transition-colors gap-1 cursor-pointer">
      <span className="font-medium">{`${phrase}`}</span>
      <span className=" text-gray-600">{userName}</span>
    </li>
  );
}
