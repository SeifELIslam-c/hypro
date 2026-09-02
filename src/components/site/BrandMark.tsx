import hyproLogo from "@/assets/hypro-logo.webp";
import { cn } from "@/lib/utils";

/** HYPRO logo mark */
export function BrandMark({
  className,
  imgClassName,
  ring = true,
}: {
  className?: string;
  imgClassName?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative grid place-items-center",
        ring && "rounded-full bg-charcoal",
        className,
      )}
    >
      {ring && (
        <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/25" />
      )}
      <img
        src={hyproLogo || "/favicon.png"}
        alt="Logo HYPRO"
        loading="eager"
        decoding="async"
        className={cn("w-[68%] h-[68%] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]", imgClassName)}
      />
    </span>
  );
}
