import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal | Bit-A",
  description: "Políticas legales y términos de servicio de Bit-A",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-40 pb-12">
        {children}
      </div>
    </div>
  );
} 