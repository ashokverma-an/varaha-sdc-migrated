import Layout from '@/components/layout/Layout';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout userRole="superadmin">
      {children}
    </Layout>
  );
}