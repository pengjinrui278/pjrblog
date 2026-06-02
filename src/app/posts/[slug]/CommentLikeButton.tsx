"use client";

import { useState } from "react";

export function CommentLikeButton({
  commentId,
  initialLiked,
  initialCount,
  toggleCommentLike,
}: {
  commentId: string;
  initialLiked: boolean;
  initialCount: number;
  toggleCommentLike: (commentId: string) => Promise<void>;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function handleClick() {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    await toggleCommentLike(commentId);
  }

  return (
    <button
      onClick={handleClick}
      className={`text-xs flex items-center gap-1 transition-colors ${
        liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
