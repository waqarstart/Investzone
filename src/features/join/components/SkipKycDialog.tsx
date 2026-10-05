import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SkipKycDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SkipKycDialog({ open, onOpenChange, onConfirm }: SkipKycDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip KYC for now?</DialogTitle>
          <DialogDescription>
            Your account will be created, but it will be marked as Not KYC verified. You can complete
            KYC any time later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep going
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-[#F5B544] font-semibold text-[#14213D] hover:bg-[#E9A72F]"
          >
            Skip for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}