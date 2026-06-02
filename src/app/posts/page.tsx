import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">所有文章</h1>

      {posts.length === 0 ? (
        <p className="text-center py-20 text-gray-400">还没有文章</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{post.author.name || post.author.email}</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </span>
                <span>💬 {post._count.comments}</span>
                <span>❤️ {post._count.likes}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
