import { Link } from "react-router-dom"
import { Logo } from "@/components/auth/Logo"

export function JoinHeader() {
  return (
    <header className="w-full border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1380px] items-center justify-between px-6 md:h-[65px] md:px-12">
        <Logo size={44} wordmarkSize="text-[28px]" />

        <div className="flex items-center gap-2 text-sm text-[#475569]">
          <span className="hidden sm:inline">Already a member?</span>
          <Link
            to="/"
            className="rounded-full px-1 py-2 font-bold text-[#3F4FA0] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3F4FA0]/25"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}
