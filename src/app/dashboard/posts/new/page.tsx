"use client";

import { createPost } from "@/lib/actions";
import { useState, useTransition } from "react";

export default function NewPostPage() {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createPost(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold mb-6">写文章</h2>
      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="文章标题"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            摘要 (可选)
          </label>
          <input
            name="excerpt"
            type="text"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="简短描述"
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
            placeholder="开始写你的故事..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "发布中..." : "发布文章"}
          </button>
        </div>
      </form>
    </div>
  );
}
