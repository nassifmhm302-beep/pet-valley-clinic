import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/booking/BookingWizard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "احجز موعدًا",
  description: "احجز موعدًا لحيوانك الأليف في عيادة بيت فالي البيطرية خلال دقائق.",
};

export default function BookingPage() {
  return (
    <div className="bg-pv-beige/30 py-12">
      <div className="container-pv max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="الحجز الإلكتروني" title="احجز موعدًا لحيوانك الأليف" align="center" />
        </Reveal>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96" />}>
            <BookingWizard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
