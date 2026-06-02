import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createComment, deleteComment, toggleLike } from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LikeButton } from "./LikeButton";
import { CommentForm } from "./CommentForm";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { slug: decodedSlug },
    include: {
      author: { select: { id: true, name: true, email: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) notFound();

  // Check if current user has liked
  let liked = false;
  if (session?.user?.id) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: post.id,
        },
      },
    });
    liked = !!existing;
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block"
        >
          ← 返回首页
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{post.author.name || post.author.email}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="prose max-w-none mb-10 bg-white rounded-lg border p-8">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Like */}
      <div className="flex items-center gap-3 mb-10 pb-8 border-b">
        <LikeButton
          postId={post.id}
          initialLiked={liked}
          initialCount={post._count.likes}
          toggleLike={toggleLike}
        />
      </div>

      {/* Comments */}
      <section>
        <h2 className="text-xl font-bold mb-6">
          评论 ({post._count.comments})
        </h2>

        {session?.user ? (
          <CommentForm
            postId={post.id}
            createComment={createComment}
          />
        ) : (
          <p className="text-sm text-gray-400 mb-6">
            <Link href="/login" className="text-blue-600 hover:underline">
              登录
            </Link>{" "}
            后可以发表评论
          </p>
        )}

        <div className="space-y-4 mt-6">
          {post.comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.author.name || comment.author.email}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                {session?.user?.id === comment.authorId && (
                  <form
                    action={deleteComment.bind(null, comment.id)}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      删除
                    </button>
                  </form>
                )}
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}

          {post.comments.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              暂无评论，来写下第一条吧
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
