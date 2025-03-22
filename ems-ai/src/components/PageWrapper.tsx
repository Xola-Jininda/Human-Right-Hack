export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#0a192f] to-[#172b4d] min-h-screen">
      {children}
    </div>
  );
} 