import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AMBER_BUTTON, ANY_TICKET, LOCATIONS, SECTORS, STAGES, TICKET_RANGES } from "../lib";
import type { Preferences, Sector, Stage } from "../types";
import { useOpportunitiesStore } from "../useOpportunitiesStore";

function toggle<T extends string>(list: T[], item: T, on: boolean): T[] {
  return on ? [...list, item] : list.filter((x) => x !== item);
}

function PreferencesForm({ onClose }: { onClose: () => void }) {
  const current = useOpportunitiesStore.getState().prefs;
  const [sectors, setSectors] = useState<Sector[]>(current.sectors);
  const [stages, setStages] = useState<Stage[]>(current.stages);
  const [ticket, setTicket] = useState(current.ticket ?? ANY_TICKET);
  const [location, setLocation] = useState(current.location ?? "Global");

  function save() {
    const next: Preferences = { sectors, stages, ticket: ticket === ANY_TICKET ? null : ticket, location };
    useOpportunitiesStore.getState().savePrefs(next);
    toast.success("Preferences saved");
    onClose();
  }

  return (
    <>
      <div className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[#14213D]">Sector</legend>
          <div className="grid grid-cols-2 gap-2">
            {SECTORS.map((s) => (
              <Label key={s} className="flex min-h-11 items-center gap-2 text-[13px] font-normal md:min-h-0">
                <Checkbox checked={sectors.includes(s)} onCheckedChange={(on) => setSectors((l) => toggle(l, s, on === true))} />
                {s}
              </Label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[#14213D]">Stage</legend>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((s) => (
              <Label key={s} className="flex min-h-11 items-center gap-2 text-[13px] font-normal md:min-h-0">
                <Checkbox checked={stages.includes(s)} onCheckedChange={(on) => setStages((l) => toggle(l, s, on === true))} />
                {s}
              </Label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-2 block text-sm">Ticket size range</Label>
            <Select value={ticket} onValueChange={setTicket}>
              <SelectTrigger aria-label="Ticket size range"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(TICKET_RANGES).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-sm">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger aria-label="Location"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter className="mt-2 gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="button" onClick={save} className={AMBER_BUTTON}>Save preferences</Button>
      </DialogFooter>
    </>
  );
}

export function PreferencesDialog() {
  const open = useOpportunitiesStore((s) => s.panel === "preferences");
  const setPanel = useOpportunitiesStore.getState().setPanel;
  return (
    <Dialog open={open} onOpenChange={(o) => setPanel(o ? "preferences" : null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Your preferences</DialogTitle>
          <DialogDescription>Tailor the deal flow you see. Matching lists update when you save.</DialogDescription>
        </DialogHeader>
        <PreferencesForm onClose={() => setPanel(null)} />
      </DialogContent>
    </Dialog>
  );
}
