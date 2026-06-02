"use client";

export function DeleteButton({ postId }: { postId: string }) {
  // Note: This button is inside a form with action={deletePost.bind(null, postId)}
  // The onClick on the form's submit button prevents form submission on cancel
  return (
    <button
      type="submit"
      className="text-sm text-red-500 hover:underline"
      onClick={(e) => {
        if (!confirm("确定删除这篇文章？此操作不可恢复。")) {
          e.preventDefault();
        }
      }}
    >
      删除
    </button>
  );
}
