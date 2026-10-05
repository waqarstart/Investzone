import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "../useMediaQuery";
import { useOpportunitiesStore } from "../useOpportunitiesStore";
import { LogoTile } from "./LogoTile";

export function MyPostsSheet() {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const wide = useMediaQuery("(min-width: 640px)");
  const open = useOpportunitiesStore((s) => s.panel === "posts");
  const mandates = useOpportunitiesStore((s) => s.ownMandates);
  const raises = useOpportunitiesStore((s) => s.ownRaises);
  const { deletePost, setPanel } = useOpportunitiesStore.getState();
  const posts = [...mandates, ...raises];

  function remove(id: string) {
    deletePost(id);
    setConfirmId(null);
    toast("Post deleted");
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { setPanel(o ? "posts" : null); setConfirmId(null); }}>
      <SheetContent side={wide ? "right" : "bottom"} className={cn("overflow-y-auto", wide ? "w-full sm:max-w-md" : "max-h-[85vh]")}>
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Manage my posts</SheetTitle>
          <SheetDescription>Opportunities you've published in this session.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          {posts.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#94A3B8]">You haven't posted any opportunities yet.</p>
          ) : (
            <ul>
              {posts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-[#E5E7EB] py-3 last:border-b-0">
                  <LogoTile initials={p.initials} bg={p.bg} fg={p.fg} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#14213D]">{p.title}</p>
                    <p className="truncate text-xs text-[#475569]">{p.subtitle}</p>
                  </div>
                  {confirmId === p.id ? (
                    <div className="flex gap-1">
                      <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmId(null)}>Cancel</Button>
                      <Button type="button" size="sm" onClick={() => remove(p.id)} className="bg-[#D9442F] text-white hover:bg-[#C23B28]">Confirm</Button>
                    </div>
                  ) : (
                    <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmId(p.id)} className="text-[#D9442F]">Delete</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
