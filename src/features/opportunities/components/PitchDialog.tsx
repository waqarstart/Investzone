import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AMBER_BUTTON } from "../lib";
import type { Mandate } from "../types";
import { useAllListings, useOpportunitiesStore } from "../useOpportunitiesStore";
import { FieldError } from "./FieldError";

const schema = z.object({
  subject: z.string().min(5, "Subject needs at least 5 characters").max(80, "Subject must be 80 characters or fewer"),
  message: z.string().min(30, "Message needs at least 30 characters").max(800, "Message must be 800 characters or fewer"),
  deck: z.enum(["AgriFlow Seed Deck", "None"]),
});
type PitchValues = z.infer<typeof schema>;

function PitchForm({ mandate, onClose }: { mandate: Mandate; onClose: () => void }) {
  const { register, control, handleSubmit, watch, formState } = useForm<PitchValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject: `Pitch for ${mandate.title}`.slice(0, 80), message: "", deck: "None" },
  });
  const { errors, isSubmitting } = formState;

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 900));
    useOpportunitiesStore.getState().addPitched(mandate.id);
    toast.success(`Pitch sent to ${mandate.investor} (demo)`);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="pitch-subject" className="mb-2 block">Subject</Label>
        <Input id="pitch-subject" aria-invalid={!!errors.subject} {...register("subject")} />
        <FieldError message={errors.subject?.message} />
      </div>
      <div>
        <Label htmlFor="pitch-message" className="mb-2 block">Message</Label>
        <Textarea id="pitch-message" rows={5} aria-invalid={!!errors.message} {...register("message")} />
        <div className="flex justify-between gap-2">
          <FieldError message={errors.message?.message} />
          <p className="ml-auto mt-1 text-xs text-[#94A3B8]">{watch("message").length}/800</p>
        </div>
      </div>
      <div>
        <Label className="mb-2 block">Attach deck</Label>
        <Controller
          control={control}
          name="deck"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Attach deck"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AgriFlow Seed Deck">AgriFlow Seed Deck</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className={`w-full ${AMBER_BUTTON}`}>
        {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
        Send pitch
      </Button>
    </form>
  );
}

export function PitchDialog() {
  const targetId = useOpportunitiesStore((s) => s.pitchTargetId);
  const { mandates } = useAllListings();
  const mandate = mandates.find((m) => m.id === targetId);
  const close = () => useOpportunitiesStore.getState().setPitchTarget(null);
  return (
    <Dialog open={!!mandate} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Pitch to this investor</DialogTitle>
          <DialogDescription>{mandate?.investor}</DialogDescription>
        </DialogHeader>
        {mandate && <PitchForm key={mandate.id} mandate={mandate} onClose={close} />}
      </DialogContent>
    </Dialog>
  );
}
