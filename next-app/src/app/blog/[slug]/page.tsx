import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import Reveal from "@/components/Reveal";
import { formatDateAr } from "@/lib/format";

export const revalidate = 0;

async function getArticle(slug: string) {
  const rows = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: [article.coverImageUrl] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || !article.isPublished) notFound();

  const related = await db
    .select()
    .from(articles)
    .where(and(eq(articles.category, article.category), eq(articles.isPublished, true), ne(articles.id, article.id)))
    .limit(3);

  return (
    <div className="py-12">
      <div className="container-pv max-w-3xl">
        <nav className="mb-4 text-xs text-pv-stone">
          <Link href="/blog" className="hover:text-pv-green-dark">المدونة</Link> / {article.title}
        </nav>
        <Reveal>
          <span className="rounded-full bg-pv-honey-light px-3 py-1 text-xs font-bold text-pv-green-dark">{article.category}</span>
          <h1 className="mt-4 text-2xl font-extrabold text-pv-green-dark sm:text-3xl">{article.title}</h1>
          <div className="mt-3 flex items-center gap-3 text-xs text-pv-stone">
            <span>{formatDateAr(article.publishedAt)}</span>
            {article.author && <span>• {article.author}</span>}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mt-6 aspect-video overflow-hidden rounded-3xl shadow-xl">
            <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="pv-prose mt-8 text-pv-text" dangerouslySetInnerHTML={{ __html: article.content }} />
        </Reveal>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-pv-cream px-3 py-1 text-xs text-pv-stone">#{t}</span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-extrabold text-pv-green-dark">مقالات ذات صلة</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {related.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-pv-border/60">
                  <div className="relative h-32 overflow-hidden">
                    <Image src={a.coverImageUrl} alt={a.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="line-clamp-2 p-3 text-xs font-bold text-pv-text">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
