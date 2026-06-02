import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions";
import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";

export default async function DashboardPage() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    where: { authorId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true, likes: true } },
    },
  });

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">你还没有写过文章</p>
          <Link
            href="/dashboard/posts/new"
            className="text-blue-600 hover:underline"
          >
            开始写第一篇 →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  标题
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  日期
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                  评论
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                  点赞
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-gray-900 hover:text-blue-600 font-medium"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">
                    {post._count.comments}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">
                    {post._count.likes}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        编辑
                      </Link>
                      <form
                        action={deletePost.bind(null, post.id)}
                        className="inline"
                      >
                        <DeleteButton postId={post.id} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
