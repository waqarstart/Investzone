import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";
import { useChatStore } from "../useChatStore";
import { ChatFooter } from "./ChatFooter";
import { ContactPanel } from "./ContactPanel";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";

const HEADER = "var(--app-header-h,80px)";

export function ChatShell() {
  const [params, setParams] = useSearchParams();
  const reduce = useReducedMotion();
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const conversations = useChatStore((s) => s.conversations);
  const panelOpen = useChatStore((s) => s.panelOpen);
  const [sheetOpen, setSheetOpen] = useState(false);

  const active = conversations.find((c) => c.id === params.get("c")) ?? null;
  const firstId = conversations[0]?.id;
  const activeId = active?.id ?? null;

  useEffect(() => {
    if (isLg && !active && firstId) setParams({ c: firstId }, { replace: true });
  }, [isLg, active, firstId, setParams]);

  useEffect(() => {
    const state = useChatStore.getState();
    state.setActive(activeId);
    if (activeId) state.openConversation(activeId);
  }, [activeId]);

  const fullScreen = !isLg && !!active;
  const showPanel = isXl && panelOpen && !!active;
  const toggleInfo = () => (isXl ? useChatStore.getState().setPanelOpen(!panelOpen) : setSheetOpen(true));
  const open = (id: string) => setParams({ c: id });

  return (
    <div className={cn("mx-auto w-full max-w-[1400px]", fullScreen ? "" : "px-3 pt-3 sm:px-6 lg:pt-4")}>
      <div
        style={{ ["--hdr" as string]: HEADER }}
        className={cn(
          "grid overflow-hidden border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_rgba(16,24,40,0.05)]",
          "lg:h-[calc(100dvh-var(--hdr)-64px)] lg:min-h-[560px] lg:rounded-[20px]",
          fullScreen
            ? "h-[calc(100dvh-var(--hdr))] rounded-none border-0 shadow-none"
            : "h-[calc(100dvh-var(--hdr)-var(--mobile-tabbar-h,64px)-12px)] rounded-[20px]",
          showPanel
            ? "grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)_340px]"
            : "grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]",
        )}
      >
        {(isLg || !active) && <ConversationList activeId={activeId} onOpen={open} onDeleted={(id) => id === activeId && setParams({}, { replace: true })} />}
        {active && (
          <ConversationView key={active.id} conversation={active} showBack={!isLg} onBack={() => setParams({})} onInfo={toggleInfo} />
        )}
        {showPanel && active && (
          <motion.div initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex min-h-0 min-w-0 flex-col">
            <ContactPanel conversation={active} onClose={() => useChatStore.getState().setPanelOpen(false)} />
          </motion.div>
        )}
      </div>
      <Sheet open={sheetOpen && !isXl} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-none lg:w-[380px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Contact Info</SheetTitle>
            <SheetDescription>Details and shared items for this contact</SheetDescription>
          </SheetHeader>
          {active && <ContactPanel conversation={active} onClose={() => setSheetOpen(false)} />}
        </SheetContent>
      </Sheet>
      {!fullScreen && <ChatFooter />}
    </div>
  );
}
