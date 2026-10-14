import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default function DoctorCard({
  slug,
  name,
  title,
  bio,
  photoUrl,
}: {
  slug: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-pv-border/60 transition hover:-translate-y-1 hover:shadow-card-hover sm:flex-row">
      <Link href={`/doctors/${slug}`} className="relative block h-64 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48">
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="200px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-extrabold text-pv-green-dark">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-pv-teal">{title}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-pv-stone">{bio}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/doctors/${slug}`}
            className="rounded-full border border-pv-border px-4 py-2 text-xs font-bold text-pv-green-dark transition hover:bg-pv-cream"
          >
            الملف الشخصي
          </Link>
          <Link
            href={`/booking?doctor=${slug}`}
            className="flex items-center gap-1.5 rounded-full pv-cta px-4 py-2 text-xs font-bold transition"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            احجز مع الطبيب
          </Link>
        </div>
      </div>
    </div>
  );
}
