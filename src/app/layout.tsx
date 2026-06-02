import type { Metadata } from "next";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "PJR Blog",
  description: "个人博客 - 记录学习与成长",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-xl text-gray-900">
                PJR Blog
              </Link>
              <Link href="/posts" className="text-sm text-gray-600 hover:text-gray-900">
                文章
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    管理后台
                  </Link>
                  <span className="text-sm text-gray-400">
                    {session.user.name || session.user.email}
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      退出
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800"
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
