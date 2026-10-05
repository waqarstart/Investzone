import { useState } from "react"
import type { FormEvent } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "sonner"
import { JoinHeader } from "@/features/join/components/JoinHeader"
import { JoinStepper } from "@/features/join/components/JoinStepper"
import { ProfileSummary } from "@/features/join/components/ProfileSummary"
import { StepContact } from "@/features/join/components/StepContact"
import { StepFrame } from "@/features/join/components/StepFrame"
import { StepLocation } from "@/features/join/components/StepLocation"
import { StepName } from "@/features/join/components/StepName"
import { StepRole } from "@/features/join/components/StepRole"
import { StepSecurity } from "@/features/join/components/StepSecurity"
import { StepVerification } from "@/features/join/components/StepVerification"
import { SuccessView } from "@/features/join/components/SuccessView"
import { maskEmail, maskPhone } from "@/features/join/lib/contact"
import { STEP_FIELDS, createStepResolver, type FormValues } from "@/features/join/schemas"
import { STEPS } from "@/features/join/steps"
import { useJoinStore } from "@/features/join/useJoinStore"

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const DEFAULT_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  contactMethod: "phone",
  phone: "",
  email: "",
  otp: "",
  captchaToken: "",
  location: "",
  role: "",
}

export default function JoinPage() {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  const saveProfile = useJoinStore((state) => state.saveProfile)

  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  const form = useForm<FormValues>({
    resolver: createStepResolver(stepIndex),
    mode: "onTouched",
    defaultValues: DEFAULT_VALUES,
  })

  const { control } = form
  const captchaToken = useWatch({ control, name: "captchaToken" })
  const contactMethod = useWatch({ control, name: "contactMethod" })
  const phone = useWatch({ control, name: "phone" })
  const email = useWatch({ control, name: "email" })
  const firstName = useWatch({ control, name: "firstName" })
  const otp = useWatch({ control, name: "otp" })

  const completedCount = done ? STEPS.length : stepIndex
  const step = STEPS[stepIndex]
  const continueLabel = stepIndex === STEPS.length - 1 ? "Create my account" : "Continue"
  const continueBlocked = stepIndex === 3 && !captchaToken
  const continueDisabled = stepIndex === 2 && otp.length !== 6

  const contactLabel = contactMethod === "phone"
    ? phone
      ? maskPhone(phone)
      : "your phone"
    : email
      ? maskEmail(email)
      : "your inbox"
  const helper = step.helper.replace("{contact}", contactLabel)

  const goToStep = (index: number) => {
    if (isLoading || done) return
    if (index < 0 || index >= STEPS.length || index === stepIndex) return
    setDirection(index > stepIndex ? 1 : -1)
    setStepIndex(index)
  }

  const goPrevious = () => {
    if (stepIndex > 0) goToStep(stepIndex - 1)
  }

  const focusFirstInvalidField = () => {
    const { errors } = form.formState
    if (errors.phone) document.getElementById("phone-input")?.focus()
    else if (errors.otp) document.getElementById("otp-input")?.focus()
  }

  const handleContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading || done) return

    const valid = await form.trigger(STEP_FIELDS[stepIndex], { shouldFocus: true })
    if (!valid) {
      focusFirstInvalidField()
      return
    }

    if (stepIndex === 0) {
      form.setValue("firstName", form.getValues("firstName").trim())
      form.setValue("lastName", form.getValues("lastName").trim())
    }

    if (stepIndex === 1) {
      form.setValue("email", form.getValues("email").trim().toLowerCase())
      setIsLoading(true)
      await wait(700)
      setIsLoading(false)
      toast("Verification code sent (demo)")
    } else if (stepIndex === 2) {
      setIsLoading(true)
      await wait(600)
      setIsLoading(false)
      toast("Contact verified")
    } else if (stepIndex === 4) {
      form.setValue("location", form.getValues("location").trim())
    } else if (stepIndex === STEPS.length - 1) {
      setIsLoading(true)
      await wait(1200)

      const values = form.getValues()
      saveProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        contact: values.contactMethod === "phone" ? values.phone : values.email,
        location: values.location.trim(),
        role: values.role as "investor" | "founder",
      })

      setIsLoading(false)
      setDone(true)
      return
    }

    setDirection(1)
    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1))
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] font-['Inter'] text-[#14213D]">
      <JoinHeader />

      <main className="mx-auto w-full max-w-[1380px] flex-1 px-6 pb-16 md:px-12">
        <div className="py-8 md:py-12">
          <JoinStepper
            activeIndex={done ? -1 : stepIndex}
            completedCount={completedCount}
            onSelectStep={goToStep}
          />
        </div>

        <FormProvider {...form}>
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[58fr_42fr] xl:gap-8">
          <section
            id="join-step-card"
            tabIndex={-1}
            className="flex min-h-[640px] flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.04)] focus:outline-none"
          >
              <form onSubmit={handleContinue} noValidate className="flex h-full flex-col">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={done ? "done" : stepIndex}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir > 0 ? 40 : -40 }),
                      center: { opacity: 1, x: 0 },
                      exit: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir > 0 ? -40 : 40 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
                    className="flex h-full flex-col"
                  >
                    {done ? (
                      <SuccessView
                        firstName={firstName.trim() || "there"}
                        onContinue={() => navigate("/home")}
                      />
                    ) : (
                      <StepFrame
                        stepIndex={stepIndex}
                        helper={helper}
                        continueLabel={continueLabel}
                        continueDisabled={continueDisabled}
                        continueBlocked={continueBlocked}
                        isLoading={isLoading}
                        canPrevious={stepIndex > 0}
                        onPrevious={goPrevious}
                      >
                        {stepIndex === 0 ? <StepName /> : null}
                        {stepIndex === 1 ? <StepContact /> : null}
                        {stepIndex === 2 ? (
                          <StepVerification onEditContact={() => goToStep(1)} />
                        ) : null}
                        {stepIndex === 3 ? <StepSecurity /> : null}
                        {stepIndex === 4 ? <StepLocation /> : null}
                        {stepIndex === 5 ? <StepRole /> : null}
                      </StepFrame>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
          </section>

          <ProfileSummary completedCount={completedCount} />
        </div>
        </FormProvider>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-[#475569] md:flex-row md:px-12">
          <p>© {new Date().getFullYear()} Bridgeway. All rights reserved.</p>
          <p className="text-[#94A3B8]">
            Step {Math.min(completedCount + 1, STEPS.length)} of {STEPS.length} ·{" "}
            {Math.round((completedCount / STEPS.length) * 100)}% complete
          </p>
        </div>
      </footer>

      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}
