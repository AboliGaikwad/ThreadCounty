export default function DashboardLayout({ children }) {
  return (
    <section className="min-h-screen bg-black text-white">
      {/* Your sidebar or header can go here later */}
      <main>{children}</main>
    </section>
  );
}