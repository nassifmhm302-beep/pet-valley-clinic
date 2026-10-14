import type { Metadata } from "next";
import { Cairo, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/BackToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { getSetting } from "@/db/queries";
import type { SiteContact, TopBarContent } from "@/db/queries";
import { SITE } from "@/lib/constants";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo-var", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito-var", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE.nameAr} | ${SITE.nameEn}`,
    template: `%s | ${SITE.nameAr}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.nameAr,
    description: SITE.description,
    siteName: SITE.nameAr,
    locale: "ar_JO",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const contact = await getSetting<SiteContact>("contact", {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    instagram: SITE.instagram,
    facebook: "",
    hoursText: "",
  });
  const topbar = await getSetting<TopBarContent>("topbar", {
    locationText: "",
    hoursText: "",
    promoText: "",
    trackOrderEnabled: true,
    whatsapp: "",
  });

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${nunito.variable}`}>
      <body className="bg-pv-cream text-pv-text antialiased">
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <TopBar data={topbar} />
              <Header />
              <main>{children}</main>
              <Footer contact={contact} />
              <BackToTop />
              <WhatsAppButton phone={contact.whatsapp} />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
