"use client";

import { renderContent } from "@/lib/tag-parser";
import Link from "next/link";

interface TaggedContentProps {
  content: string;
}

export function TaggedContent({ content }: TaggedContentProps) {
  const parts = renderContent(content);

  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return <span key={index}>{part}</span>;
        }

        if (part.type === "mention") {
          const username = part.value.slice(1);
          return (
            <Link
              key={index}
              href={`/profile/${username}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {part.value}
            </Link>
          );
        }

        if (part.type === "hashtag") {
          const tag = part.value.slice(1);
          return (
            <Link
              key={index}
              href={`/search?tag=${tag}`}
              className="text-amber-600 hover:underline dark:text-amber-400"
            >
              {part.value}
            </Link>
          );
        }

        return part;
      })}
    </>
  );
}
