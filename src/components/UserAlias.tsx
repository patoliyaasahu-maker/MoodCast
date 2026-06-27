import { DemoUserChip } from "./DemoUserChip";

type Props = {
  alias: string;
  isDemo?: boolean;
  isYou?: boolean;
  size?: "sm" | "md";
};

export function UserAlias({ alias, isDemo, isYou, size = "sm" }: Props) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={
          size === "md"
            ? "text-sm font-medium text-violet-300"
            : "text-sm font-medium text-violet-300"
        }
      >
        {alias}
        {isYou ? " (you)" : ""}
      </span>
      {isDemo && <DemoUserChip />}
    </span>
  );
}
