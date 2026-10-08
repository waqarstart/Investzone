import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { AccountCreatedPanel } from "@/features/join/components/AccountCreatedPanel";
import { AddressStep } from "@/features/join/components/AddressStep";
import { BasicInfoStep } from "@/features/join/components/BasicInfoStep";
import { DocumentStep } from "@/features/join/components/DocumentStep";
import { FinalView } from "@/features/join/components/FinalView";
import { JoinHeader } from "@/features/join/components/JoinHeader";
import { JoinStepper } from "@/features/join/components/JoinStepper";
import { OtpPanel } from "@/features/join/components/OtpPanel";
import { ProfileSummary } from "@/features/join/components/ProfileSummary";
import { RegistrationStep } from "@/features/join/components/RegistrationSteps";
import { SelfieStep } from "@/features/join/components/SelfieStep";
import { SkipKycDialog } from "@/features/join/components/SkipKycDialog";
import { StepFrame } from "@/features/join/components/StepFrame";
import { VerificationStep } from "@/features/join/components/VerificationStep";
import { maskEmail, maskPhone } from "@/features/join/lib/contact";
import {
  DEFAULT_VALUES,
  STEP_FIELDS,
  createResolver,
  type FormValues,
  type ValidationKey,
} from "@/features/join/schemas";
import { ADDRESS_VERIFICATION_REQUIRED, STEPS } from "@/features/join/steps";
import { useJoinStore } from "@/features/join/useJoinStore";
import { useKycDraft } from "@/features/join/useKycDraft";
import { useKycStore } from "@/features/join/useKycStore";
import { requiresBackSide, splitName, wait } from "@/lib/documents";
import { clearJoinDraft, loadJoinDraft, saveJoinDraft, updateUser } from "@/lib/storage";

type Phase = "details" | "otp" | "created";

const STEP_VALIDATION: ValidationKey[] = ["registration", "basic", "document", "none", "none", "address"];

function getValidationKey(stepIndex: number, phase: Phase): ValidationKey {
  if (stepIndex === 0) return phase === "otp" ? "otp" : phase === "details" ? "registration" : "none";
  return STEP_VALIDATION[stepIndex];
}

function initialStep(resume: boolean): number {
  if (!resume) return 0;
  const { stepStatus } = useKycStore.getState();
  const index = STEPS.findIndex((step, i) => i >= 1 && stepStatus[step.key] !== "completed");
  return index === -1 ? STEPS.length - 1 : index;
}

function KycFlow({ resume }: { resume: boolean }) {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const saveProfile = useJoinStore((state) => state.saveProfile);

  const stepStatus = useKycStore((s) => s.stepStatus);
  const accountCreated = useKycStore((s) => s.accountCreated);
  const kycStatus = useKycStore((s) => s.kycStatus);
  const displayName = useKycStore((s) => s.displayName);
  const maskedContact = useKycStore((s) => s.maskedContact);
  const role = useKycStore((s) => s.role);

  const verification = useKycDraft((s) => s.verification);
  const selfie = useKycDraft((s) => s.selfie);
  const setFileError = useKycDraft((s) => s.setFileError);

  const [stepIndex, setStepIndex] = useState(() => initialStep(resume));
  const [phase, setPhase] = useState<Phase>(resume ? "created" : "details");
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [final, setFinal] = useState<"verified" | "skipped" | null>(null);
  const [skipOpen, setSkipOpen] = useState(false);

  const validationKey = getValidationKey(stepIndex, phase);
  const [initialValues] = useState<FormValues>(() => ({
    ...DEFAULT_VALUES,
    ...loadJoinDraft(),
    otp: "",
  }));
  const form = useForm<FormValues>({
    resolver: createResolver(validationKey),
    mode: "onTouched",
    defaultValues: initialValues,
  });
  const values = useWatch({ control: form.control }) as FormValues;

  // Debounced draft save: skips unchanged values and stops once the flow is finished.
  const lastSaved = useRef("");
  useEffect(() => {
    if (final) return undefined;
    const snapshot = JSON.stringify({ ...values, otp: undefined });
    if (snapshot === lastSaved.current) return undefined;
    const timer = window.setTimeout(() => {
      lastSaved.current = snapshot;
      saveJoinDraft(values);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [values, final]);

  useEffect(() => {
    useKycDraft.getState().reset();
    if (resume) useKycStore.getState().resumeFromSkipped();
    else useKycStore.getState().reset();
    return () => useKycDraft.getState().reset();
  }, [resume]);

  const step = STEPS[stepIndex];
  const maxReachable = (() => {
    const index = STEPS.findIndex((item) => stepStatus[item.key] !== "completed");
    return index === -1 ? STEPS.length - 1 : index;
  })();
  const canSelect = (index: number) =>
    !isLoading && !final && accountCreated && phase === "created" && index >= 1 && index <= maxReachable;

  const goToStep = (index: number) => {
    if (index === stepIndex || index < 0 || index >= STEPS.length) return;
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(index);
  };

  const contactLabel =
    values.contactMethod === "phone"
      ? values.phone
        ? maskPhone(values.phone)
        : "your phone"
      : values.email
        ? maskEmail(values.email)
        : "your inbox";

  const completedCount = STEPS.filter((item) => stepStatus[item.key] === "completed").length;
  const onAccountPanel = stepIndex === 0 && phase === "created";

  const caption = final
    ? final === "verified"
      ? "KYC COMPLETE"
      : "ACCOUNT READY"
    : stepIndex === 0
      ? "STEP 1 OF 6 · CREATE YOUR ACCOUNT"
      : `STEP ${stepIndex + 1} OF 6 · KYC VERIFICATION`;

  let heading = step.heading;
  let helper = step.helper;
  if (stepIndex === 0 && phase === "otp") {
    heading = "Enter your code";
    helper = `We sent a 6-digit code to ${contactLabel}.`;
  }

  const continueLabel =
    stepIndex === 0
      ? phase === "otp"
        ? "Verify and create account"
        : "Send verification code"
      : step.key === "address"
        ? "Submit for verification"
        : "Continue";

  const continueDisabled =
    (stepIndex === 0 && phase === "otp" && values.otp.length !== 6) ||
    (step.key === "verification" && verification !== "passed") ||
    (step.key === "selfie" && selfie !== "matched");

  const confirmSkip = () => {
    useKycStore.getState().skipRemaining();
    clearJoinDraft();
    updateUser({ kycStatus: "skipped" });
    setSkipOpen(false);
    setFinal("skipped");
  };

  const handleContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || final || onAccountPanel) return;

    if (validationKey !== "none") {
      const valid = await form.trigger(STEP_FIELDS[validationKey], { shouldFocus: true });
      if (!valid) return;
    }

    const v = form.getValues();
    const store = useKycStore.getState();

    if (step.key === "registration" && phase === "details") {
      setIsLoading(true);
      await wait(700);
      setIsLoading(false);
      toast("Verification code sent (demo)");
      setPhase("otp");
      return;
    }

    if (step.key === "registration" && phase === "otp") {
      setIsLoading(true);
      await wait(800);
      const { firstName, lastName } = splitName(v.fullName);
      const contact = v.contactMethod === "phone" ? v.phone : v.email.trim().toLowerCase();
      const masked = v.contactMethod === "phone" ? maskPhone(v.phone) : maskEmail(contact);
      store.createAccount({
        displayName: v.fullName.trim(),
        maskedContact: masked,
        role: v.role as "investor" | "founder",
      });
      updateUser({
        displayName: v.fullName.trim(),
        firstName,
        lastName,
        contact,
        maskedContact: masked,
        role: v.role as "investor" | "founder",
        kycStatus: "none",
        createdAt: Date.now(),
      });
      saveProfile({ firstName, lastName, contact, location: "", role: v.role as "investor" | "founder" });
      setIsLoading(false);
      toast.success("Account created");
      setDirection(1);
      setPhase("created");
      return;
    }

    if (step.key === "document") {
      const needsBack = requiresBackSide(v.docType);
      const { idFront, idBack } = useKycDraft.getState();
      setFileError("idFront", idFront ? undefined : "Upload the front of your document");
      setFileError("idBack", needsBack && !idBack ? "Upload the back of your document" : undefined);
      if (!idFront || (needsBack && !idBack)) return;
    }

    if (step.key === "address") {
      const { addressProof } = useKycDraft.getState();
      if (ADDRESS_VERIFICATION_REQUIRED && !addressProof) {
        setFileError("addressProof", "Upload your proof of address");
        return;
      }
      setIsLoading(true);
      await wait(1500);
      store.completeStep("address");
      useKycStore.getState().markVerified();
      clearJoinDraft();
      updateUser({ kycStatus: "verified" });
      setIsLoading(false);
      setFinal("verified");
      return;
    }

    if (step.key === "basic") {
      const { firstName, lastName } = splitName(v.fullName);
      const contact = v.contactMethod === "phone" ? v.phone : v.email;
      const location = [v.city, v.country].filter(Boolean).join(", ");
      saveProfile({
        firstName,
        lastName,
        contact,
        location,
        role: (store.role || "investor") as "investor" | "founder",
      });
      updateUser({ firstName, lastName, contact, location });
    }

    store.completeStep(step.key);
    setDirection(1);
    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const renderStep = () => {
    switch (step.key) {
      case "registration":
        return phase === "otp" ? (
          <OtpPanel contactLabel={contactLabel} onEdit={() => setPhase("details")} />
        ) : (
          <RegistrationStep />
        );
      case "basic":
        return <BasicInfoStep />;
      case "document":
        return <DocumentStep />;
      case "verification":
        return <VerificationStep onBackToDocument={() => goToStep(2)} />;
      case "selfie":
        return <SelfieStep />;
      case "address":
        return <AddressStep onEditAddress={() => goToStep(1)} />;
    }
  };

  const cardKey = final ? `final-${final}` : onAccountPanel ? "created" : `${stepIndex}-${phase}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] font-['Inter'] text-[#14213D]">
      <JoinHeader />

      <main className="mx-auto w-full max-w-[1380px] flex-1 px-4 pb-16 sm:px-6 md:px-12">
        <div className="py-8 md:py-6">
          <JoinStepper
            caption={caption}
            activeIndex={final ? -1 : stepIndex}
            statuses={stepStatus}
            canSelect={canSelect}
            onSelect={goToStep}
          />
        </div>

        <FormProvider {...form}>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[58fr_42fr] xl:gap-8">
            <section
              id="join-step-card"
              className="flex min-h-[640px] flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.04)]"
            >
              <form onSubmit={handleContinue} noValidate className="flex h-full flex-1 flex-col">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={cardKey}
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
                    className="flex h-full flex-1 flex-col"
                  >
                    {final ? (
                      <FinalView
                        status={final}
                        firstName={splitName(values.fullName || displayName).firstName || "there"}
                        onHome={() => navigate("/home")}
                        onResume={() => navigate("/kyc")}
                      />
                    ) : onAccountPanel ? (
                      <AccountCreatedPanel onContinue={() => goToStep(1)} onSkip={() => setSkipOpen(true)} />
                    ) : (
                      <StepFrame
                        eyebrow={`STEP ${stepIndex + 1} OF 6 · ${step.eyebrow}`}
                        heading={heading}
                        helper={helper}
                        continueLabel={continueLabel}
                        continueDisabled={continueDisabled}
                        isLoading={isLoading}
                        canPrevious={stepIndex >= 2}
                        onPrevious={() => goToStep(stepIndex - 1)}
                        canSkip={stepIndex >= 1}
                        onSkip={() => setSkipOpen(true)}
                      >
                        {renderStep()}
                      </StepFrame>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </section>

            <ProfileSummary
              values={values}
              statuses={stepStatus}
              activeKey={final ? null : step.key}
              kycStatus={kycStatus}
              persisted={{ displayName, maskedContact, role }}
            />
          </div>
        </FormProvider>
      </main>

      <SkipKycDialog open={skipOpen} onOpenChange={setSkipOpen} onConfirm={confirmSkip} />

      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-slate-600 md:flex-row md:px-12">
          <p>© {new Date().getFullYear()} Bridgeway. All rights reserved.</p>
          <p className="text-[#94A3B8]">
            {completedCount} of {STEPS.length} steps complete
          </p>
        </div>
      </footer>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export default function JoinPage({ resume = false }: { resume?: boolean }) {
  const accountCreated = useKycStore((state) => state.accountCreated);
  if (resume && !accountCreated) return <Navigate to="/join" replace />;
  return <KycFlow resume={resume} />;
}