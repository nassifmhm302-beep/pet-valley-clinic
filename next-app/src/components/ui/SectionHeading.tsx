export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-start"}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-pv-honey-light px-4 py-1.5 text-xs font-bold text-pv-green-dark">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-extrabold text-pv-green-dark sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-pv-stone ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
