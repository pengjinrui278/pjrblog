"use client";

import { useState, useTransition, useRef } from "react";

export function ReplyForm({
  commentId,
  replyToComment,
}: {
  commentId: string;
  replyToComment: (
    commentId: string,
    formData: FormData
  ) => Promise<{ error?: string } | void>;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await replyToComment(commentId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        formRef.current?.reset();
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-blue-500"
      >
        回复
      </button>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-2 space-y-2">
      <textarea
        name="content"
        required
        rows={2}
        className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="写下你的回复..."
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-gray-900 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "提交中..." : "回复"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          取消
        </button>
      </div>
    </form>
  );
}
