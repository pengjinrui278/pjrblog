"use client";

import { useState, useTransition } from "react";

export default function EditForm({
  post,
  updatePost,
}: {
  post: { id: string; title: string; content: string; excerpt: string | null };
  updatePost: (
    id: string,
    formData: FormData
  ) => Promise<{ error?: string } | void>;
}) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(post.content);

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await updatePost(post.id, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标题
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={post.title}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          摘要 (可选)
        </label>
        <input
          name="excerpt"
          type="text"
          defaultValue={post.excerpt || ""}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          正文 (支持 Markdown)
        </label>
        <textarea
          name="content"
          required
          rows={16}
          className="w-full border rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "保存中..." : "保存修改"}
      </button>
    </form>
  );
}
