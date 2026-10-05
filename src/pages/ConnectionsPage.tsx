import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { useConnections } from "@/features/connections/useConnections";
import type { NetworkTab } from "@/features/connections/types";
import { NetworkSidebar } from "@/features/connections/components/NetworkSidebar";
import {
  CelebrationSection,
  ConnectionsSection,
  EventsView,
  InvitationSection,
  PagesView,
  PeopleSection,
} from "@/features/connections/components/NetworkSections";

const tabs: NetworkTab[] = [
  "invitations",
  "celebrations",
  "all",
  "familiar",
  "events",
  "pages",
];
export default function ConnectionsPage() {
  const [params] = useSearchParams();
  const value = params.get("tab") as NetworkTab | null;
  const active = value && tabs.includes(value) ? value : null;
  const network = useConnections();
  const reduced = useReducedMotion();
  const connectionCount = 1505 + network.network.length - 12;
  const invitationProps = {
    items: network.invites,
    onAccept: network.accept,
    onIgnore: network.ignore,
    onUndo: network.restore,
  };
  return (
    <main className="mx-auto w-full max-w-[1280px] min-w-0 overflow-x-clip px-4 pb-28 pt-4 sm:px-6 lg:pb-24 lg:pt-6">
      <h1 className="sr-only">Connections</h1>
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <NetworkSidebar
          invitationCount={network.invites.length + 8}
          connectionCount={connectionCount}
        />
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active ?? "overview"}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="min-w-0 space-y-6"
            >
              {active === "invitations" ? (
                <InvitationSection {...invitationProps} focused />
              ) : active === "celebrations" ? (
                <CelebrationSection focused />
              ) : active === "all" ? (
                <ConnectionsSection
                  items={network.network}
                  onRemove={network.remove}
                  focused
                />
              ) : active === "familiar" ? (
                <PeopleSection
                  items={network.suggestions}
                  pending={network.pending}
                  onTogglePending={network.togglePending}
                  onDismiss={network.dismiss}
                  focused
                />
              ) : active === "events" ? (
                <EventsView />
              ) : active === "pages" ? (
                <PagesView />
              ) : (
                <>
                  <InvitationSection {...invitationProps} />
                  <CelebrationSection />
                  <ConnectionsSection
                    items={network.network}
                    onRemove={network.remove}
                  />
                  <PeopleSection
                    items={network.suggestions}
                    pending={network.pending}
                    onTogglePending={network.togglePending}
                    onDismiss={network.dismiss}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#E5E7EB] py-4 text-xs text-[#64748B] sm:flex-row">
        <span>© 2026 Bridgeway</span>
        <nav aria-label="Footer" className="flex gap-4">
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#help">Help</a>
        </nav>
      </footer>
    </main>
  );
}
