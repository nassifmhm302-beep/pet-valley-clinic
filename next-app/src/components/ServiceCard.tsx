import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck } from "lucide-react";

export default function ServiceCard({
  slug,
  name,
  shortDescription,
  imageUrl,
}: {
  slug: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-pv-border/60 transition hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/services/${slug}`} className="relative block h-56 overflow-hidden sm:h-64">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-extrabold text-pv-green-dark">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-pv-stone">{shortDescription}</p>
        <div className="mt-5 flex items-center gap-3">
          <Link
            href={`/services/${slug}`}
            className="flex items-center gap-1.5 text-sm font-bold text-pv-teal hover:text-pv-green-dark"
          >
            اكتشف الخدمة
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href={`/booking?service=${slug}`}
            className="mr-auto flex items-center gap-1.5 rounded-full pv-cta px-4 py-2 text-xs font-bold transition"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            احجز هذه الخدمة
          </Link>
        </div>
      </div>
    </div>
  );
}
