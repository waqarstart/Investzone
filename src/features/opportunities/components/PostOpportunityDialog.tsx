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
import { AMBER_BUTTON, SECTORS } from "../lib";
import type { Mandate, Raise } from "../types";
import { useOpportunitiesStore } from "../useOpportunitiesStore";
import { FieldError } from "./FieldError";

const schema = z.object({
  kind: z.enum(["mandate", "raise"]),
  title: z.string().min(5, "Title needs at least 5 characters").max(80, "Title must be 80 characters or fewer"),
  sector: z.enum(SECTORS),
  amount: z.string().refine((v) => Number(v) > 0, "Enter an amount greater than 0 (PKR millions)"),
  description: z.string().min(20, "Description needs at least 20 characters").max(500, "Description must be 500 characters or fewer"),
});
type PostValues = z.infer<typeof schema>;

function buildListing(v: PostValues): Mandate | Raise {
  const amount = Number(v.amount);
  const base = {
    id: `own-${Date.now()}`,
    title: v.title,
    initials: v.title.split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase(),
    bg: "#3F4FA0",
    fg: "#FFFFFF",
    sectors: [v.sector],
    stages: ["Seed" as const],
    region: "Pakistan" as const,
    postedAgo: "Just now",
    own: true,
  };
  if (v.kind === "mandate") {
    return {
      ...base,
      investor: "You",
      subtitle: `You · ${v.sector} · Remote friendly`,
      chips: [`Ticket up to PKR ${amount}M`, v.sector],
      ticketMinM: Math.max(1, Math.round(amount / 2)),
      ticketMaxM: amount,
      thesis: v.description,
      recent: [],
      tag: { text: "Your post", tinted: true },
    };
  }
  return {
    ...base,
    company: v.title,
    subtitle: `${v.sector} · Pakistan · Open round`,
    pitch: v.description,
    raisedM: 0,
    targetM: amount,
    minTicketM: Math.max(1, Math.round(amount / 10)),
    interested: 0,
    interestedBy: [],
    closingDays: 30,
    founders: "Posted by you",
    traction: "Details shared on request.",
  };
}

function PostForm({ onClose }: { onClose: () => void }) {
  const { register, control, handleSubmit, formState } = useForm<PostValues>({
    resolver: zodResolver(schema),
    defaultValues: { kind: "raise", title: "", sector: "FinTech", amount: "", description: "" },
  });
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: PostValues) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const listing = buildListing(values);
    const store = useOpportunitiesStore.getState();
    if ("investor" in listing) store.addMandate(listing);
    else store.addRaise(listing);
    toast.success("Opportunity posted (demo)");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-2 block">Post as</Label>
          <Controller control={control} name="kind" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Post as"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mandate">Investor mandate</SelectItem>
                <SelectItem value="raise">Founder raise</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
        <div>
          <Label className="mb-2 block">Sector</Label>
          <Controller control={control} name="sector" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Sector"><SelectValue /></SelectTrigger>
              <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          )} />
        </div>
      </div>
      <div>
        <Label htmlFor="post-title" className="mb-2 block">Title</Label>
        <Input id="post-title" aria-invalid={!!errors.title} {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>
      <div>
        <Label htmlFor="post-amount" className="mb-2 block">Amount (PKR millions)</Label>
        <Input id="post-amount" type="number" inputMode="decimal" min="0" aria-invalid={!!errors.amount} {...register("amount")} />
        <FieldError message={errors.amount?.message} />
      </div>
      <div>
        <Label htmlFor="post-description" className="mb-2 block">Description</Label>
        <Textarea id="post-description" rows={4} aria-invalid={!!errors.description} {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>
      <Button type="submit" disabled={isSubmitting} className={`w-full ${AMBER_BUTTON}`}>
        {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
        Publish
      </Button>
    </form>
  );
}

export function PostOpportunityDialog() {
  const open = useOpportunitiesStore((s) => s.panel === "post");
  const setPanel = useOpportunitiesStore.getState().setPanel;
  return (
    <Dialog open={open} onOpenChange={(o) => setPanel(o ? "post" : null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Post an opportunity</DialogTitle>
          <DialogDescription>Publish an investor mandate or a founder raise to the marketplace.</DialogDescription>
        </DialogHeader>
        <PostForm onClose={() => setPanel(null)} />
      </DialogContent>
    </Dialog>
  );
}
