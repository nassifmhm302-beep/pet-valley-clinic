import Link from "next/link";
import { MapPin, Clock, PackageSearch, MessageCircle } from "lucide-react";
import type { TopBarContent } from "@/db/queries";

export default function TopBar({ data }: { data: TopBarContent }) {
  return (
    <div className="hidden bg-pv-green-dark text-white md:block">
      <div className="container-pv flex h-10 items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          {data.locationText && (
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin className="h-3.5 w-3.5 text-pv-honey-light" />
              {data.locationText}
            </span>
          )}
          {data.hoursText && (
            <span className="flex items-center gap-1.5 opacity-90">
              <Clock className="h-3.5 w-3.5 text-pv-honey-light" />
              {data.hoursText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-5">
          {data.promoText && (
            <span className="font-semibold text-pv-honey-light">{data.promoText}</span>
          )}
          {data.trackOrderEnabled && (
            <Link href="/account" className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
              <PackageSearch className="h-3.5 w-3.5" />
              تتبع الطلب
            </Link>
          )}
          {data.whatsapp && (
            <a
              href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-90 hover:opacity-100"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              واتساب
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
