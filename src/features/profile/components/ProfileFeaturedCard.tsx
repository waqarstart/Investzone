import { useState } from 'react'
import {
  ExternalLink,
  FileText,
  Lock,
  Plus,
  Presentation,
  Sparkles,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProfileStore } from '../useProfileStore'

export function ProfileFeaturedCard() {
  const profile = useProfileStore((state) => state.profile)
  const isFounder = profile.role === 'founder'
  const [deckModalOpen, setDeckModalOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      title: 'Problem: $18B Cold-Chain Food Loss in Emerging Agriculture',
      bullet1: '72% of smallholder farmers lack real-time telematics and climate-controlled freight.',
      bullet2: 'Middlemen mark up prices by 340% while 30% of harvest rots in transit.',
      highlight: 'TAM: $4.2B South Asian Ag Logistics Market',
    },
    {
      title: 'Solution: AgriFlow Telemetry & Bilateral Escrow Protocol',
      bullet1: 'Hardware IoT sensor nodes installed at farm-gate cold vaults.',
      bullet2: 'Automated smart-contract escrow settlement on shipment delivery.',
      highlight: 'Unit Economics: 68% Gross Margin per Telemetry Node',
    },
    {
      title: 'Traction: $480K ARR & 3.2x YoY Expansion',
      bullet1: '14,000+ active farming clusters onboarded across 4 major agricultural zones.',
      bullet2: 'Seed Round Target: $1.2M (40% Lead Committed by Meridian & Apex).',
      highlight: 'Use of Funds: 60% Telemetry Hardware, 25% Tech Scale, 15% Ops',
    },
  ]

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#14213D]">Featured Assets</h2>
            <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#3730A3]">
              Pinned Vault
            </span>
          </div>

          <button
            type="button"
            onClick={() => toast.info('You can pin more documents, posts, or links')}
            className="flex items-center gap-1 text-xs font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add asset</span>
          </button>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.featured.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === 'deck') {
                  setDeckModalOpen(true)
                } else {
                  toast.success(`Opening ${item.title}`)
                }
              }}
              className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#3F4FA0] hover:bg-white hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#14213D]">
                    {item.type === 'deck' ? (
                      <Presentation className="size-4 text-[#F5B544]" />
                    ) : item.type === 'deal_room' ? (
                      <Lock className="size-4 text-[#3F4FA0]" />
                    ) : (
                      <FileText className="size-4 text-[#7C5CBF]" />
                    )}
                    <span className="truncate max-w-[180px]">{item.title}</span>
                  </span>
                  {item.badge && (
                    <span className="rounded bg-[#14213D] px-1.5 py-0.5 text-[9px] font-bold text-[#F5B544]">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E2E8F0]/60">
                {item.metrics ? (
                  <span className="text-[11px] font-bold text-emerald-700">{item.metrics}</span>
                ) : (
                  <span className="text-[10px] text-[#94A3B8]">Audited Security Vault</span>
                )}
                <span className="flex items-center gap-1 text-xs font-bold text-[#3F4FA0] group-hover:translate-x-0.5 transition-transform">
                  <span>{item.type === 'deck' ? 'Preview Deck' : 'Access Vault'}</span>
                  <ExternalLink className="size-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Interactive Pitch Deck Preview Modal */}
      {deckModalOpen && (
        <Dialog open={deckModalOpen} onOpenChange={setDeckModalOpen}>
          <DialogContent className="!w-[94vw] !max-w-[760px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl [&>button]:hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4 bg-[#14213D] text-white">
              <div className="flex items-center gap-2">
                <Presentation className="size-5 text-[#F5B544]" />
                <DialogTitle className="text-base font-bold text-white">
                  {isFounder ? 'AgriFlow Seed Round Pitch Deck' : 'Syndicate Deal Memorandum'}
                </DialogTitle>
              </div>
              <button
                type="button"
                onClick={() => setDeckModalOpen(false)}
                className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Slide Body */}
            <div className="p-6 bg-[#0f172a] text-white flex-1 min-h-[320px] flex flex-col justify-between select-none">
              <div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3">
                  <span className="font-mono text-[#F5B544]">SLIDE {activeSlide + 1} OF {slides.length}</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">CONFIDENTIAL</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-4 leading-snug">
                  {slides[activeSlide].title}
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed pl-4 list-disc">
                  <li>{slides[activeSlide].bullet1}</li>
                  <li>{slides[activeSlide].bullet2}</li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-[#F5B544] flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  <span>{slides[activeSlide].highlight}</span>
                </span>
                <span className="text-[11px] text-slate-400">Bridgeway Certified Deck</span>
              </div>
            </div>

            {/* Carousel Navigation Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#E2E8F0] bg-white">
              <div className="flex gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeSlide ? 'w-6 bg-[#3F4FA0]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={activeSlide === slides.length - 1}
                  onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                  className="rounded-full px-4 py-1.5 text-xs font-bold text-white bg-[#14213D] disabled:opacity-40 hover:bg-[#233866] transition-colors"
                >
                  Next Slide →
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
