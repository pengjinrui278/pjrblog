import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/lib/actions";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold mb-6">编辑文章</h2>
      <EditForm post={post} updatePost={updatePost} />
    </div>
  );
}
