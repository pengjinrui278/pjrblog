import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createComment,
  deleteComment,
  toggleLike,
  replyToComment,
  toggleCommentLike,
} from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LikeButton } from "./LikeButton";
import { CommentForm } from "./CommentForm";
import { ReplyForm } from "./ReplyForm";
import { CommentLikeButton } from "./CommentLikeButton";

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
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
          _count: { select: { likes: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, email: true } },
              _count: { select: { likes: true } },
            },
          },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) notFound();

  // Check if current user has liked the post
  let postLiked = false;
  if (session?.user?.id) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: post.id,
        },
      },
    });
    postLiked = !!existing;
  }

  // Check which comments the user has liked
  const commentIds = [
    ...post.comments.map((c) => c.id),
    ...post.comments.flatMap((c) => c.replies.map((r) => r.id)),
  ];
  let userCommentLikes: Set<string> = new Set();
  if (session?.user?.id && commentIds.length > 0) {
    const likes = await prisma.commentLike.findMany({
      where: {
        userId: session.user.id,
        commentId: { in: commentIds },
      },
    });
    userCommentLikes = new Set(likes.map((l) => l.commentId));
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

      {/* Post Like */}
      <div className="flex items-center gap-3 mb-10 pb-8 border-b">
        <LikeButton
          postId={post.id}
          initialLiked={postLiked}
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
          <CommentForm postId={post.id} createComment={createComment} />
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
            <CommentItem
              key={comment.id}
              comment={comment}
              sessionUserId={session?.user?.id}
              userCommentLikes={userCommentLikes}
            />
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

// Separate component for a comment + its replies
function CommentItem({
  comment,
  sessionUserId,
  userCommentLikes,
  depth = 0,
}: {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author: { id: string; name: string | null; email: string };
    _count: { likes: number };
    replies?: Array<{
      id: string;
      content: string;
      createdAt: Date;
      authorId: string;
      author: { id: string; name: string | null; email: string };
      _count: { likes: number };
    }>;
  };
  sessionUserId?: string;
  userCommentLikes: Set<string>;
  depth?: number;
}) {
  return (
    <div>
      <div
        className={`bg-white rounded-lg border p-4 ${depth > 0 ? "ml-6 border-l-4 border-l-blue-100" : ""}`}
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
          {sessionUserId === comment.authorId && (
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
        <p className="text-gray-700 text-sm whitespace-pre-wrap mb-3">
          {comment.content}
        </p>
        <div className="flex items-center gap-4">
          <CommentLikeButton
            commentId={comment.id}
            initialLiked={userCommentLikes.has(comment.id)}
            initialCount={comment._count.likes}
            toggleCommentLike={toggleCommentLike}
          />
          {sessionUserId && depth === 0 && (
            <ReplyForm
              commentId={comment.id}
              replyToComment={replyToComment}
            />
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              sessionUserId={sessionUserId}
              userCommentLikes={userCommentLikes}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
