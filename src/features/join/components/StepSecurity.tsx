import { useEffect, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useFormContext } from "react-hook-form"
import { ShieldCheck } from "lucide-react"
import type { FormValues } from "../schemas"

const SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

export function StepSecurity() {
  const {
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<FormValues>()

  const [compact, setCompact] = useState(false)
  const error = errors.captchaToken?.message

  useEffect(() => {
    const query = window.matchMedia("(max-width: 380px)")
    const update = () => setCompact(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-5 py-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#3F4FA0]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#14213D]">Protected by Google reCAPTCHA</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#475569]">
            A quick check keeps bots and fake profiles out of the network.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ReCAPTCHA
          sitekey={SITE_KEY}
          size={compact ? "compact" : "normal"}
          theme="light"
          onChange={(token) => {
            setValue("captchaToken", token ?? "", { shouldDirty: true, shouldValidate: true })
          }}
          onExpired={() => {
            setValue("captchaToken", "", { shouldDirty: true })
            void trigger("captchaToken")
          }}
          onErrored={() => {
            setValue("captchaToken", "", { shouldDirty: true })
            void trigger("captchaToken")
          }}
        />
        <div id="captcha-error" aria-live="polite">
          {error ? (
            <p role="alert" className="text-[13px] font-medium text-[#F2705A]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
