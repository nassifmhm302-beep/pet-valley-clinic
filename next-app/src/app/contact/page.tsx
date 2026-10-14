import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSetting } from "@/db/queries";
import type { SiteContact } from "@/db/queries";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "تواصل معنا" };
export const revalidate = 0;

export default async function ContactPage() {
  const contact = await getSetting<SiteContact>("contact", {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    instagram: "",
    facebook: "",
    hoursText: "",
  });

  return (
    <div className="py-14">
      <div className="container-pv">
        <Reveal>
          <SectionHeading eyebrow="تواصل معنا" title="يسعدنا تواصلك معنا" align="center" />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="space-y-5 rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60">
              {contact.phone && (
                <Item icon={Phone} label="الهاتف" value={contact.phone} href={`tel:${contact.phone}`} dir="ltr" />
              )}
              {contact.email && <Item icon={Mail} label="البريد الإلكتروني" value={contact.email} href={`mailto:${contact.email}`} />}
              {contact.address && <Item icon={MapPin} label="العنوان" value={contact.address} />}
              {contact.hoursText && <Item icon={Clock} label="ساعات العمل" value={contact.hoursText} />}
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-pv-teal hover:text-pv-green-dark">
                  حسابنا على إنستغرام ↗
                </a>
              )}
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl shadow-card">
              <iframe
                src="https://www.google.com/maps?q=Amman%20Jordan&output=embed"
                title="موقع العيادة"
                loading="lazy"
                className="h-64 w-full border-0"
              />
            </div>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-pv-border/60 sm:p-8">
              <h2 className="mb-5 text-lg font-extrabold text-pv-green-dark">أرسل لنا رسالة</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  value,
  href,
  dir,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
  dir?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pv-cream text-pv-green">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-xs text-pv-stone">{label}</p>
        <p className="font-bold text-pv-text" dir={dir}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
