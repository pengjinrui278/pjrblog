"use server";

import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- Auth Actions ---

const registerSchema = z.object({
  name: z.string().min(1, "请输入用户名"),
  email: z.string().email("请输入有效的邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
});

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "该邮箱已被注册" };
  }

  const hashed = await hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "请输入邮箱和密码" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch {
    return { error: "邮箱或密码错误" };
  }
}

// --- Post Actions ---

const postSchema = z.object({
  title: z.string().min(1, "请输入标题"),
  content: z.string().min(1, "请输入内容"),
  excerpt: z.string().optional(),
});

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { title, content, excerpt } = parsed.data;

  // Generate slug from title
  const slug =
    title
      .toLowerCase()
      .replace(/[^\w一-鿿]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now().toString(36);

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 150),
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    return { error: "无权编辑此文章" };
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { title, content, excerpt } = parsed.data;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      excerpt: excerpt || content.slice(0, 150),
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${post.slug}`);
  redirect("/dashboard");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/dashboard");
}

// --- Comment Actions ---

export async function createComment(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const content = formData.get("content") as string;
  if (!content?.trim()) {
    return { error: "请输入评论内容" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true },
  });

  await prisma.comment.create({
    data: {
      content: content.trim(),
      authorId: session.user.id,
      postId,
    },
  });

  revalidatePath(`/posts/${post?.slug}`);
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { slug: true } } },
  });

  if (!comment || comment.authorId !== session.user.id) {
    redirect("/");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/posts/${comment.post.slug}`);
}

// --- Like Actions ---

export async function toggleLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const existing = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, postId },
    });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true },
  });

  revalidatePath(`/posts/${post?.slug}`);
}

export async function getLikeCount(postId: string) {
  return prisma.like.count({ where: { postId } });
}

export async function hasLiked(postId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const like = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  return !!like;
}
