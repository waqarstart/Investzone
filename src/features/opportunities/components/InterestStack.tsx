import { AvatarStack } from "./AvatarStack";

export function InterestStack({ seeds, count }: { seeds: string[]; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <AvatarStack seeds={seeds} />
      <span className="text-[12.5px] text-[#475569]">{count} interested investors</span>
    </div>
  );
}
