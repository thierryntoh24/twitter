import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NavBar({
  title,
  back,
  url,
}: {
  title: string;
  back?: boolean;
  url?: string;
}) {
  return (
    <div className="h-14 w-full flex gap-3 items-center border-b border-gray-200 px-6">
      {back && url && (
        <Link href={url}>
          <ArrowLeft />
        </Link>
      )}
      <h1 className="font-medium">{title}</h1>
    </div>
  );
}
