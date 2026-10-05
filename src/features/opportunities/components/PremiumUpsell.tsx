import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AMBER_BUTTON } from "../lib";
import { AvatarStack } from "./AvatarStack";

const TONES = { grey: "bg-[#F6F6F4]", warm: "bg-[#FFF3DB]" } as const;

interface Props {
  tone: keyof typeof TONES;
  icon: LucideIcon;
  title: string;
  muted: string;
  emphasis: string;
}

export function PremiumUpsell({ tone, icon: Icon, title, muted, emphasis }: Props) {
  return (
    <div className={`mt-6 flex flex-col gap-3 rounded-2xl p-3.5 sm:flex-row sm:items-center ${TONES[tone]}`}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-[#14213D]">
          <Icon className="size-5 text-[#F5B544]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#14213D]">{title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#475569]">
            <AvatarStack seeds={["MK", "SA", "RT"]} />
            <span>{muted} · <strong className="font-medium text-[#14213D]">{emphasis}</strong></span>
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => toast("Premium is coming soon (demo)")}
        className={`h-11 w-full rounded-full px-4 sm:w-auto md:h-9 ${AMBER_BUTTON}`}
      >
        Try Premium
      </Button>
    </div>
  );
}
