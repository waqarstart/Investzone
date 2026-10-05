import { zodResolver } from "@hookform/resolvers/zod"
import { isValidPhoneNumber } from "libphonenumber-js"
import type { FieldErrors, Resolver } from "react-hook-form"
import { z } from "zod"

export type FormValues = {
  firstName: string
  lastName: string
  contactMethod: "phone" | "email"
  phone: string
  email: string
  otp: string
  captchaToken: string
  location: string
  role: "" | "investor" | "founder"
}

export const STEP_FIELDS: ReadonlyArray<readonly (keyof FormValues)[]> = [
  ["firstName", "lastName"],
  ["contactMethod", "phone", "email"],
  ["otp"],
  ["captchaToken"],
  ["location"],
  ["role"],
]

const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u
const LOCATION_PART_PATTERN = /^[\p{L}\s.'-]{2,}$/u

const createNameField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, "Enter at least 2 characters")
    .max(50, "Use 50 characters or fewer")
    .regex(NAME_PATTERN, "Use letters only")

const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .max(100, "Email must be 100 characters or fewer")
  .email("Enter a valid email address")

const nameStepSchema = z.object({
  firstName: createNameField("First name"),
  lastName: createNameField("Last name"),
})

const contactStepSchema = z
  .object({
    contactMethod: z.enum(["phone", "email"]),
    phone: z.string(),
    email: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.contactMethod === "phone") {
      const digits = value.phone.replace(/\D/g, "")
      if (!digits) {
        ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter your mobile number" })
        return
      }
      if (!isValidPhoneNumber(value.phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Enter a valid phone number for the selected country",
        })
      }
      return
    }

    const parsedEmail = emailField.safeParse(value.email)
    if (!parsedEmail.success) {
      for (const issue of parsedEmail.error.issues) {
        ctx.addIssue({ code: "custom", path: ["email"], message: issue.message })
      }
    }
  })

const otpStepSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
})

const securityStepSchema = z.object({
  captchaToken: z.string().min(1, "Please confirm you're not a robot"),
})

const locationStepSchema = z.object({
  location: z
    .string()
    .trim()
    .min(1, "Enter your location")
    .max(120, "Location must be 120 characters or fewer")
    .superRefine((value, ctx) => {
      const parts = value.split(",").map((part) => part.trim())
      const isValid = parts.length >= 2 && parts.every((part) => LOCATION_PART_PATTERN.test(part))
      if (!isValid) {
        ctx.addIssue({ code: "custom", message: "Use the format City, State, Country" })
      }
    }),
})

const roleStepSchema = z.object({
  role: z.enum(["investor", "founder"], {
    message: "Please choose how you want to join",
  }),
})

export const STEP_SCHEMAS = [
  nameStepSchema,
  contactStepSchema,
  otpStepSchema,
  securityStepSchema,
  locationStepSchema,
  roleStepSchema,
]

export function createStepResolver(stepIndex: number): Resolver<FormValues> {
  const schema = STEP_SCHEMAS[stepIndex] as unknown as z.ZodType<FormValues, FormValues>
  const validate = zodResolver(schema)

  return async (values, context, options) => {
    const result = await validate(values, context, options)

    if (Object.keys(result.errors).length > 0) {
      return { errors: result.errors as unknown as FieldErrors<FormValues>, values: {} as Record<string, never> }
    }

    return { errors: {} as Record<string, never>, values }
  }
}
