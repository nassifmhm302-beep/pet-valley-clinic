import Link from "next/link";
import { MapPin, Phone, Mail, PawPrint } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import { SITE, FOOTER_LEGAL_LINKS } from "@/lib/constants";
import type { SiteContact } from "@/db/queries";

export default function Footer({ contact }: { contact: SiteContact }) {
  return (
    <footer className="mt-20 bg-pv-green-dark text-white">
      <div className="container-pv grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <PawPrint className="h-6 w-6 text-pv-honey-light" />
            </span>
            <span className="text-lg font-extrabold">{SITE.nameAr}</span>
          </Link>
          <p className="mt-4 text-sm leading-7 text-white/75">{SITE.description}</p>
          <div className="mt-5 flex items-center gap-3">
            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="إنستغرام"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-pv-teal"
              >
                <InstagramIcon />
              </a>
            )}
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-pv-teal"
              >
                <FacebookIcon />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-pv-honey-light">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li><Link href="/services" className="hover:text-white">خدماتنا</Link></li>
            <li><Link href="/doctors" className="hover:text-white">فريقنا الطبي</Link></li>
            <li><Link href="/shop" className="hover:text-white">المتجر</Link></li>
            <li><Link href="/blog" className="hover:text-white">المدونة</Link></li>
            <li><Link href="/branches" className="hover:text-white">الفروع</Link></li>
            <li><Link href="/booking" className="hover:text-white">احجز موعدًا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-pv-honey-light">معلومات قانونية</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-pv-honey-light">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-white/80">
            {contact.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pv-honey-light" />
                {contact.address}
              </li>
            )}
            {contact.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-pv-honey-light" />
                <a href={`tel:${contact.phone}`} className="hover:text-white" dir="ltr">{contact.phone}</a>
              </li>
            )}
            {contact.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-pv-honey-light" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-pv flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.nameAr} — جميع الحقوق محفوظة</p>
          <Link href="/admin" className="hover:text-white/90">لوحة الإدارة</Link>
        </div>
      </div>
    </footer>
  );
}
