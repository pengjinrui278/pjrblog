"use client";

import { useState } from "react";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  toggleLike,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  toggleLike: (postId: string) => Promise<void>;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function handleClick() {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    await toggleLike(postId);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        liked
          ? "bg-red-50 border-red-200 text-red-500"
          : "bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"
      }`}
    >
      <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
