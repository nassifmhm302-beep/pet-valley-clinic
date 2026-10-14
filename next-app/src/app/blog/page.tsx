import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatDateAr } from "@/lib/format";

export const metadata: Metadata = { title: "المدونة" };
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await db.select().from(articles).where(eq(articles.isPublished, true)).orderBy(desc(articles.publishedAt));
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="py-14">
      <div className="container-pv">
        <Reveal>
          <SectionHeading eyebrow="المدونة" title="نصائح وإرشادات للعناية بحيوانك" align="center" />
        </Reveal>

        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <span key={c} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-pv-green-dark ring-1 ring-pv-border">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((a, i) => (
            <Reveal key={a.id} delay={i * 70}>
              <Link
                href={`/blog/${a.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-pv-border/60 transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={a.coverImageUrl} alt={a.title} fill sizes="400px" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold text-pv-teal">{a.category}</span>
                  <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold text-pv-green-dark">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-pv-stone">{a.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-pv-stone">
                    <span>{formatDateAr(a.publishedAt)}</span>
                    <span className="font-bold text-pv-green-dark">اقرأ المقال ←</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {posts.length === 0 && <p className="py-10 text-center text-pv-stone">لا توجد مقالات منشورة بعد.</p>}
      </div>
    </div>
  );
}
