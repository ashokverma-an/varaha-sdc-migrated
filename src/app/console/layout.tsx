import Layout from '@/components/layout/Layout';

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout userRole="console">
      {children}
    </Layout>
  );
}