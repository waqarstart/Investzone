import { useLocation, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** For AppLayout: hide the MessagingDock on /communications and the mobile tab bar in the conversation view. */
export function useChatChrome() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const onChat = pathname.startsWith("/communications");
  return { hideDock: onChat, hideTabBar: onChat && !isDesktop && params.has("c") };
}
