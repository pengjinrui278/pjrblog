export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-lg border p-8">{children}</div>
    </div>
  );
}
