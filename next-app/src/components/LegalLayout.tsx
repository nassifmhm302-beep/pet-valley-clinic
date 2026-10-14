import type { ReactNode } from "react";

export default function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="py-14">
      <div className="container-pv max-w-3xl">
        <h1 className="text-2xl font-extrabold text-pv-green-dark sm:text-3xl">{title}</h1>
        <div className="pv-prose mt-6 rounded-3xl bg-white p-6 text-sm text-pv-text shadow-card ring-1 ring-pv-border/60 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
