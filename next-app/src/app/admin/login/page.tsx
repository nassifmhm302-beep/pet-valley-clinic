"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, PawPrint } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "تعذّر تسجيل الدخول.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pv-green-dark px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pv-cream text-pv-green">
          <PawPrint className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-center text-xl font-extrabold text-pv-green-dark">لوحة إدارة بيت فالي</h1>
        <p className="mt-1 text-center text-xs text-pv-stone">دخول مخصص للموظفين المصرح لهم فقط</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-pv-text">اسم المستخدم</label>
            <input required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-pv-text">كلمة المرور</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full pv-cta px-6 py-3.5 text-sm font-bold disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
