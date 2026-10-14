"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-pv-cream p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-pv-green" />
        <p className="font-bold text-pv-green-dark">تم إرسال رسالتك بنجاح</p>
        <p className="text-sm text-pv-stone">سيتواصل معك فريقنا في أقرب وقت ممكن.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required value={form.name} onChange={update("name")} placeholder="الاسم الكامل" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
        <input dir="ltr" value={form.phone} onChange={update("phone")} placeholder="رقم الهاتف (اختياري)" className="rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
      </div>
      <input type="email" value={form.email} onChange={update("email")} placeholder="البريد الإلكتروني (اختياري)" className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
      <input value={form.subject} onChange={update("subject")} placeholder="موضوع الرسالة" className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
      <textarea required value={form.message} onChange={update("message")} rows={4} placeholder="رسالتك" className="w-full rounded-xl border border-pv-border px-4 py-3 text-sm outline-none focus:border-pv-teal" />
      {status === "error" && <p className="text-sm text-red-600">حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقًا.</p>}
      <button disabled={status === "loading"} className="flex w-full items-center justify-center gap-2 rounded-full pv-cta px-6 py-3.5 text-sm font-bold transition disabled:opacity-60">
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        إرسال الرسالة
      </button>
    </form>
  );
}
