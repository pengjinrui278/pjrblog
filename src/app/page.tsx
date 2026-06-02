import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          欢迎来到 PJR Blog
        </h1>
        <p className="text-gray-500 text-lg">
          记录技术学习、项目实践与个人成长
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            {post.excerpt && (
              <p className="text-gray-500 mb-3 line-clamp-2">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{post.author.name || post.author.email}</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </span>
              <span>💬 {post._count.comments}</span>
              <span>❤️ {post._count.likes}</span>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">还没有文章</p>
            {session?.user && (
              <Link
                href="/dashboard/posts/new"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                写第一篇博客 →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
