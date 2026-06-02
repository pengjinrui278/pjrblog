"use client";

import { useState, useTransition, useRef } from "react";

export function CommentForm({
  postId,
  createComment,
}: {
  postId: string;
  createComment: (
    postId: string,
    formData: FormData
  ) => Promise<{ error?: string } | void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createComment(postId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <textarea
        name="content"
        required
        rows={3}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="写下你的评论..."
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "提交中..." : "发表评论"}
      </button>
    </form>
  );
}
