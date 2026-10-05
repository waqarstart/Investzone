import type { ReactNode } from "react";

export function RowFooter({ meta, actions }: { meta: ReactNode; actions: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">{meta}</div>
      <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">{actions}</div>
    </div>
  );
}
