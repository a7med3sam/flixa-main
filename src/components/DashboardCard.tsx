export default function DashboardCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-grey-100 border border-[#E5E7EB] rounded-2xl shadow-none p-2.5 ${className}`}
    >
      {children}
    </div>
  );
}
