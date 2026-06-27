import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function Card({ children, className, title }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm",
        className
      )}
    >
      {title && (
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
