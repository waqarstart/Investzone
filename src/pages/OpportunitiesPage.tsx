import { ActionToolbar } from "@/features/opportunities/components/ActionToolbar";
import { OpportunityColumns } from "@/features/opportunities/components/OpportunityColumns";
import { OpportunityDialogs } from "@/features/opportunities/components/OpportunityDialogs";
import { PreferencesCard } from "@/features/opportunities/components/PreferencesCard";
import { Reveal } from "@/features/opportunities/components/Reveal";

export default function OpportunitiesPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6 bg-[#F6F4EF] px-4 py-6 pb-28 sm:px-6">
      <h1 className="sr-only">Opportunities</h1>
      <Reveal index={0}><PreferencesCard /></Reveal>
      <Reveal index={1}><ActionToolbar /></Reveal>
      <Reveal index={2}><OpportunityColumns /></Reveal>
      <OpportunityDialogs />
    </div>
  );
}
