"use client";

import { register } from "@/lib/actions";
import Link from "next/link";
import { useState, useTransition } from "react";
import { PasswordInput } from "@/components/PasswordInput";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await register(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">注册</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="你的昵称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            邮箱
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <PasswordInput name="password" placeholder="至少 6 位密码" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "注册中..." : "注册"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        已有账号？{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          去登录
        </Link>
      </p>
    </div>
  );
}
