import { Mail, ShieldCheck, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { FloatingStrip } from "../components/auth/FloatingStrip";
import loginIllustration from "../assets/Login screen left side image.png";

const FLOAT_AMPLITUDE_A = 8;
const FLOAT_DURATION_A = 4;
const FLOAT_DELAY_A = 0;
const FLOAT_AMPLITUDE_B = 6;
const FLOAT_DURATION_B = 4.6;
const FLOAT_DELAY_B = 0.4;

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.4 3.62v3h3.86c2.26-2.09 3.59-5.17 3.59-8.86z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.19 7.19 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="grid size-10 place-items-center rounded-xl border border-[#0E9F6E]/25 bg-[#E8FAF3]">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
        <path
          d="M3.5 16.5c3.2-6.4 8.4-9.6 15.5-9.7"
          fill="none"
          stroke="#0E9F6E"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="6.2" cy="16.8" r="1.9" fill="#0E9F6E" />
      </svg>
    </span>
  );
}

function LegalCopy() {
  return (
    <p className="mx-auto max-w-md text-center text-[13px] leading-relaxed text-[#64748B]">
      By clicking Continue to join or sign in, you agree to Bridgeway's{" "}
      <a href="#" className="font-medium text-[#0E9F6E] underline-offset-2 hover:underline">
        User Agreement
      </a>
      ,{" "}
      <a href="#" className="font-medium text-[#0E9F6E] underline-offset-2 hover:underline">
        Privacy Policy
      </a>
      , and{" "}
      <a href="#" className="font-medium text-[#0E9F6E] underline-offset-2 hover:underline">
        Cookie Policy
      </a>
      .
    </p>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-slate-200/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <LogoMark />
            <span className="text-xl font-bold tracking-tight text-[#14213D]">Bridgeway</span>
          </a>
          <nav className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-[#F7CE7F] px-6 py-2.5 text-sm font-semibold text-[#14213D] transition-colors hover:bg-[#F5B544]"
            >
              Sign in
            </button>
            <Link
              to="/join"
              className="rounded-full bg-[#F7CE7F] px-6 py-2.5 text-sm font-semibold text-[#14213D] transition-colors hover:bg-[#F5B544]"
            >
              Join now
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-12 lg:py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto w-full max-w-xl">
            <img
              src={loginIllustration}
              alt="Two professionals connecting ideas and capital through the Bridgeway network"
              className="w-full"
            />
            <FloatingStrip
              title="Verified members only"
              subtitle="100% KYC & Accredited"
              icon={<ShieldCheck className="size-4" aria-hidden="true" />}
              className="absolute -top-2 left-0 sm:left-4"
              amplitude={FLOAT_AMPLITUDE_A}
              duration={FLOAT_DURATION_A}
              delay={FLOAT_DELAY_A}
            />
            <FloatingStrip
              title="Deal flow tracked end to end"
              subtitle="Institutional cap-table sync"
              icon={<Workflow className="size-4" aria-hidden="true" />}
              className="absolute -bottom-2 right-0 sm:right-4"
              amplitude={FLOAT_AMPLITUDE_B}
              duration={FLOAT_DURATION_B}
              delay={FLOAT_DELAY_B}
            />
          </div>

          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-[#14213D] sm:text-5xl">
              Where great ideas meet the right capital.
            </h1>

            <div className="flex w-full max-w-md flex-col gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-medium text-[#14213D] transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                <GoogleGlyph />
                Continue with Google
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-medium text-[#14213D] transition-colors hover:border-slate-400 hover:bg-slate-50"
              >
                <Mail className="size-4 text-[#64748B]" aria-hidden="true" />
                Sign in with email
              </button>
            </div>

            <LegalCopy />

            <p className="text-sm text-[#64748B]">
              New to Bridgeway?{" "}
              <Link to="/join" className="font-semibold text-[#14213D] hover:underline">
                Join now
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-[13px] text-[#64748B] sm:flex-row">
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-[#14213D]">
              About
            </a>
            <span className="text-slate-400">•</span>
            <a href="#" className="hover:text-[#14213D]">
              Privacy
            </a>
            <span className="text-slate-400">•</span>
            <a href="#" className="hover:text-[#14213D]">
              Terms
            </a>
            <span className="text-slate-400">•</span>
            <a href="#" className="hover:text-[#14213D]">
              Help
            </a>
          </nav>
          <p>Regulated Syndicate Platform • © 2025 Bridgeway Capital Technologies</p>
        </div>
      </footer>
    </div>
  );
}
