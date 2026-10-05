import { ChatShell } from "@/features/communications/components/ChatShell";

export default function CommunicationsPage() {
  return (
    <div className="min-h-full bg-[#F6F4EF]">
      <h1 className="sr-only">Communications</h1>
      <ChatShell />
    </div>
  );
}
