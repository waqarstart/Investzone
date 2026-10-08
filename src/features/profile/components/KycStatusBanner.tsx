import { useState } from 'react'
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Lock, Shield, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '../useProfileStore'

export function KycStatusBanner() {
  const profile = useProfileStore((state) => state.profile)
  const updateKycStatus = useProfileStore((state) => state.updateKycStatus)
  const [dismissed, setDismissed] = useState(false)
  const [verifying, setVerifying] = useState(false)

  if (dismissed) return null

  if (profile.kycStatus === 'verified') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-white p-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Shield className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 fill-emerald-100" />
                <span>Identity & Regulatory KYC Verified</span>
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {profile.kycTier || 'Tier-1 RegTech'}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-emerald-800/80 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5 text-emerald-700" />
                <span>ID Expiry: <strong>{profile.kycExpiryDate || '14 Aug 2029'}</strong></span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Lock className="size-3 text-emerald-700" />
                <span>CNIC: <strong>Protected & Encrypted</strong></span>
              </span>
              <span>·</span>
              <span>Bilateral Deal Vault Access: <strong>Enabled</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toast.success(`Government ID is valid until ${profile.kycExpiryDate || '14 Aug 2029'}`)}
          className="shrink-0 self-start sm:self-auto rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
        >
          View Credential
        </button>
      </div>
    )
  }

  // Skipped / Pending KYC State
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/50 to-white p-4 sm:p-5 shadow-xs">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="size-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <AlertCircle className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-amber-950">Identity Verification Pending</h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Action Recommended
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-900/80 max-w-xl leading-relaxed">
              You skipped KYC during signup. Complete your Government ID verification to unlock accredited bilateral deal vaults, term sheet workflows, and your verified badge.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={verifying}
          onClick={() => {
            setVerifying(true)
            setTimeout(() => {
              updateKycStatus('verified', '14 Aug 2029')
              setVerifying(false)
              toast.success('KYC Verification completed! Verified ID badge unlocked.')
            }, 1000)
          }}
          className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#14213D] hover:bg-[#233866] text-[#F5B544] px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="size-3.5" />
          <span>{verifying ? 'Verifying CNIC…' : 'Complete KYC Now'}</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
