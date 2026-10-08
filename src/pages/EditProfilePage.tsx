import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Check,
  FileCheck,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '@/features/profile/useProfileStore'
import { useJoinStore } from '@/features/join/useJoinStore'
import type { UserRole } from '@/features/profile/types'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const profile = useProfileStore((state) => state.profile)
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const setRole = useProfileStore((state) => state.setRole)

  // Public / General Profile Fields
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [headline, setHeadline] = useState(profile.headline || '')
  const [role, setLocalRole] = useState<UserRole>(profile.role)
  const [location, setLocation] = useState(profile.location)
  const [website, setWebsite] = useState(profile.website || '')
  const [contactEmail, setContactEmail] = useState(profile.contactEmail || '')
  const [contactPhone, setContactPhone] = useState(profile.contactPhone || '')

  // Sensitive Details (Captured during KYC Verification)
  const [legalFullName, setLegalFullName] = useState(profile.legalFullName || `${profile.firstName} ${profile.lastName}`)
  const [docType, setDocType] = useState(profile.docType || 'cnic')
  const [kycExpiryDate, setKycExpiryDate] = useState(profile.kycExpiryDate || '14 Aug 2029')
  const [dob, setDob] = useState(profile.dob || '1994-08-14')
  const [nationality, setNationality] = useState(profile.nationality || 'Pakistan')
  const [gender, setGender] = useState(profile.gender || 'female')
  const [residentialAddress, setResidentialAddress] = useState(profile.residentialAddress || 'House 42-B, Block 4, Clifton')
  const [city, setCity] = useState(profile.city || 'Karachi')
  const [postalCode, setPostalCode] = useState(profile.postalCode || '75600')
  const [country, setCountry] = useState(profile.country || 'Pakistan')

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (role !== profile.role) {
      setRole(role)
    }
    updateProfile({
      firstName,
      lastName,
      headline,
      bio: profile.bio,
      role,
      location,
      website,
      contactEmail,
      contactPhone,
      openTo: profile.openTo,
      legalFullName,
      docType,
      kycExpiryDate,
      dob,
      nationality,
      gender,
      residentialAddress,
      city,
      postalCode,
      country,
    })

    // Sync to useJoinStore so home feed, posts, and composer stay in sync across reloads
    useJoinStore.getState().saveProfile({
      firstName,
      lastName,
      contact: contactPhone || contactEmail || '',
      location,
      role: role === 'investor' ? 'investor' : 'founder',
    })

    toast.success('Profile & KYC details updated successfully!')
    navigate('/profile')
  }

  return (
    <div className="mx-auto max-w-[860px] px-3 sm:px-4 py-6">
      {/* Main Edit Card Form */}
      <form onSubmit={handleSave} className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <div className="space-y-6">
          {/* Header Title with Back Button */}
          <div className="border-b border-[#F1F5F9] pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#14213D] shadow-xs hover:bg-slate-100 hover:text-[#3F4FA0] transition-colors cursor-pointer shrink-0"
                title="Back to Profile"
                aria-label="Back to Profile"
              >
                <ArrowLeft className="size-4.5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
                  <span>Edit Profile & Identity Details</span>
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Manage your public presentation and verified regulatory credentials.
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block text-xs font-semibold text-[#64748B] shrink-0">
              Bridgeway Identity & KYC Settings
            </span>
          </div>

          {/* Persona / Role Selector */}
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-2">
              Account Role / Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocalRole('founder')}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  role === 'founder'
                    ? 'border-[#F5B544] bg-[#FEF3D8]/40 ring-2 ring-[#F5B544]/20'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5B544] text-[#14213D] font-bold text-base">
                  🚀
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14213D]">Founder View</p>
                  <p className="text-[11px] text-[#64748B]">Raising capital, scaling startups & seeking advisors</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalRole('investor')}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  role === 'investor'
                    ? 'border-[#3F4FA0] bg-[#EEF2FF]/60 ring-2 ring-[#3F4FA0]/20'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#3F4FA0] text-white font-bold text-base">
                  💼
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14213D]">Investor View</p>
                  <p className="text-[11px] text-[#64748B]">Evaluating deals, syndicating allocations & LP updates</p>
                </div>
              </button>
            </div>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
          </div>

          {/* Professional Headline */}
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1.5">
              Professional Headline *
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder={role === 'founder' ? 'e.g. Founder & CEO at AgriFlow Technologies · Raising $1.2M Seed' : 'e.g. Managing Partner at Apex Capital Syndicate · Venture Syndicate'}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#64748B]" />
                <span>Public Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Karachi, Pakistan"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5 flex items-center gap-1.5">
                <Globe className="size-3.5 text-[#64748B]" />
                <span>Website / Portfolio URL</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
          </div>

          {/* Contact Email & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5 flex items-center gap-1.5">
                <Mail className="size-3.5 text-[#64748B]" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5 flex items-center gap-1.5">
                <Phone className="size-3.5 text-[#64748B]" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
          </div>

          {/* 2. SENSITIVE KYC & REGULATORY IDENTITY DETAILS */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/50 p-5 sm:p-6 space-y-5">
            {/* Header with Security Badge */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[#14213D]">
                      KYC & Government Identity Credentials
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      {profile.kycTier || 'Tier-1 RegTech & NADRA Verified'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                    <Lock className="size-3 text-emerald-700" />
                    <span>Encrypted & private. Collected during KYC onboarding verification.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Grid of Sensitive KYC Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Legal Name */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Full Legal Name (as per ID) *
                </label>
                <input
                  type="text"
                  required
                  value={legalFullName}
                  onChange={(e) => setLegalFullName(e.target.value)}
                  placeholder="Full legal name"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Identity Document Type *
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                >
                  <option value="cnic">National ID (CNIC / SNIC)</option>
                  <option value="passport">Passport</option>
                  <option value="license">Driver's License</option>
                </select>
              </div>

              {/* ID Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#64748B]" />
                  <span>ID Expiry Date *</span>
                </label>
                <input
                  type="text"
                  required
                  value={kycExpiryDate}
                  onChange={(e) => setKycExpiryDate(e.target.value)}
                  placeholder="e.g. 14 Aug 2029"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Nationality *
                </label>
                <input
                  type="text"
                  required
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. Pakistan"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
              </div>

              {/* Country of Residence */}
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Country of Residence *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Pakistan"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>
            </div>

            {/* Residential Address Field */}
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                Verified Residential Address (as per Utility Bill / ID) *
              </label>
              <input
                type="text"
                required
                value={residentialAddress}
                onChange={(e) => setResidentialAddress(e.target.value)}
                placeholder="House / Street / Apartment / Area"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Karachi"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 75600"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
                />
              </div>
            </div>

            {/* Biometric & Proof Document Statuses */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <p className="text-[11px] font-bold text-[#14213D] mb-2">
                Completed Onboarding Verifications:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">
                  <FileCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>ID Documents (Front & Back)</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>Liveness Selfie Biometrics</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">
                  <FileCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>Address Proof Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="rounded-full px-5 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] px-6 py-2.5 text-xs font-bold text-[#F5B544] shadow-sm hover:bg-[#22365c] transition-colors cursor-pointer"
          >
            <Check className="size-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  )
}
