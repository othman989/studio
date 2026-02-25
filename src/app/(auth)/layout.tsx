export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[--gradient-from] to-[--gradient-to] p-4">
      {children}
    </main>
  );
}
