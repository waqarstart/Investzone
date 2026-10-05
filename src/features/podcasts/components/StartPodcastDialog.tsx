import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Mic } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from 'cn'
import { CATEGORIES } from '../data'

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(80, 'Title must be 80 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be 500 characters or fewer'),
  category: z.string().min(1, 'Choose a category'),
})

type FormValues = z.infer<typeof schema>

const CATEGORY_OPTIONS = CATEGORIES.filter((category) => category !== 'All')

const FIELD_CLASS =
  'w-full rounded-lg border bg-white px-3 text-sm text-[#14213D] outline-none placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#3F4FA0]'

const FIELD_INVALID_CLASS = 'border-[#F2705A] aria-invalid:ring-0'
const FIELD_VALID_CLASS = 'border-[#E5E7EB]'

interface StartPodcastDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartPodcastDialog({ open, onOpenChange }: StartPodcastDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', category: '' },
  })

  async function submit() {
    await new Promise((resolve) => setTimeout(resolve, 900))
    toast('Thanks! Your podcast request was received (demo)')
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[calc(100%-2rem)] rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-bold text-[#14213D]">
            <span className="grid size-9 place-items-center rounded-full bg-[#FEF3D8] text-[#8A5A00]">
              <Mic className="size-4" />
            </span>
            Start a podcast
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#475569]">
            Tell the community what you want to record. Requests are reviewed by the Bridgeway
            team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="podcast-title" className="text-[13px] font-semibold text-[#14213D]">
              Title
            </label>
            <input
              id="podcast-title"
              type="text"
              placeholder="e.g. Inside the syndicate: a seed round teardown"
              aria-invalid={errors.title ? true : undefined}
              className={cn(
                FIELD_CLASS,
                'h-10',
                errors.title ? FIELD_INVALID_CLASS : FIELD_VALID_CLASS,
              )}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-[12px] text-[#F2705A]">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="podcast-description"
              className="text-[13px] font-semibold text-[#14213D]"
            >
              Description
            </label>
            <Textarea
              id="podcast-description"
              rows={4}
              placeholder="What will listeners take away from this episode?"
              aria-invalid={errors.description ? true : undefined}
              className={cn(
                FIELD_CLASS,
                'min-h-24 resize-y py-2 leading-relaxed',
                errors.description ? FIELD_INVALID_CLASS : FIELD_VALID_CLASS,
              )}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-[12px] text-[#F2705A]">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="podcast-category" className="text-[13px] font-semibold text-[#14213D]">
              Category
            </label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="podcast-category"
                    aria-invalid={errors.category ? true : undefined}
                    className={cn(
                      'h-10 w-full justify-between text-sm font-normal',
                      errors.category ? FIELD_INVALID_CLASS : FIELD_VALID_CLASS,
                    )}
                  >
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-[12px] text-[#F2705A]">{errors.category.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full border border-[#F5B544] bg-[#F5B544] px-6 text-sm font-bold text-[#14213D] hover:bg-[#EDAB35] hover:text-[#14213D] focus-visible:ring-[#8A5A00] disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
