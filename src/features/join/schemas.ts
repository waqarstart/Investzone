import { isValidPhoneNumber } from "libphonenumber-js";
import {
  differenceInYears,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
  subMonths,
} from "date-fns";
import type { FieldErrors, Resolver } from "react-hook-form";
import { z } from "zod";
import { DOC_FORMATS, DOC_NUMBER_ERROR, type DocType, type ProofType } from "@/lib/documents";

export interface FormValues {
  fullName: string;
  contactMethod: "phone" | "email";
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "" | "investor" | "founder";
  captchaToken: string;
  acceptTerms: boolean;
  otp: string;
  dob: string;
  nationality: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  gender: "" | "male" | "female" | "prefer_not";
  docType: "" | DocType;
  docNumber: string;
  docExpiry: string;
  proofType: "" | ProofType;
  proofIssueDate: string;
}

export const DEFAULT_VALUES: FormValues = {
  fullName: "",
  contactMethod: "phone",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  captchaToken: "",
  acceptTerms: false,
  otp: "",
  dob: "",
  nationality: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  gender: "",
  docType: "",
  docNumber: "",
  docExpiry: "",
  proofType: "",
  proofIssueDate: "",
};

export type ValidationKey = "registration" | "otp" | "basic" | "document" | "address" | "none";

export const STEP_FIELDS: Record<ValidationKey, (keyof FormValues)[]> = {
  registration: [
    "fullName",
    "contactMethod",
    "phone",
    "email",
    "password",
    "confirmPassword",
    "role",
    "captchaToken",
    "acceptTerms",
  ],
  otp: ["otp"],
  basic: [
    "fullName",
    "dob",
    "nationality",
    "addressLine1",
    "addressLine2",
    "city",
    "stateProvince",
    "postalCode",
    "country",
  ],
  document: ["docType", "docNumber", "docExpiry"],
  address: ["proofType", "proofIssueDate"],
  none: [],
};

const NAME_REGEX = /^[\p{L}][\p{L}\s'.-]*$/u;

const nameField = z
  .string()
  .trim()
  .min(2, "Enter your full legal name")
  .max(100, "Name is too long")
  .regex(NAME_REGEX, "Use letters only");

const SCHEMAS: Partial<Record<ValidationKey, z.ZodType>> = {
  registration: z.object({
    fullName: nameField,
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(64, "Use at most 64 characters")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[a-z]/, "Add a lowercase letter")
      .regex(/\d/, "Add a number"),
    role: z.string().min(1, "Please choose how you want to join"),
    captchaToken: z.string().min(1, "Please confirm you're not a robot"),
    acceptTerms: z.boolean().refine((value) => value, "Please accept the Terms and Privacy Policy"),
  }),
  otp: z.object({ otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code") }),
  basic: z.object({
    fullName: nameField,
    dob: z.string().min(1, "Enter your date of birth"),
    nationality: z.string().min(1, "Select your nationality"),
    addressLine1: z.string().trim().min(5, "Enter your street address").max(120, "Address is too long"),
    addressLine2: z.string().max(120, "Address is too long"),
    city: z.string().trim().min(2, "Enter your city").max(60, "City name is too long"),
    stateProvince: z.string().trim().min(2, "Enter your state or province").max(60, "Name is too long"),
    postalCode: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9][A-Za-z0-9\s-]{1,10}[A-Za-z0-9]$/, "Enter a valid postal code"),
    country: z.string().min(1, "Select your country"),
  }),
  document: z.object({
    docType: z.string().min(1, "Choose a document type"),
    docNumber: z.string().trim().min(1, "Enter your document number"),
    docExpiry: z.string().min(1, "Enter the expiry date"),
  }),
  address: z.object({
    proofType: z.string().min(1, "Choose a proof of address"),
    proofIssueDate: z.string().min(1, "Enter the issue date"),
  }),
};

type Errors = Partial<Record<keyof FormValues, string>>;

const CROSS_CHECKS: Partial<Record<ValidationKey, (values: FormValues) => Errors>> = {
  registration: (v) => {
    const errors: Errors = {};
    if (v.fullName.trim().split(/\s+/).length < 2) {
      errors.fullName = "Enter your first and last name";
    }
    if (v.contactMethod === "phone") {
      if (v.phone.replace(/\D/g, "").length < 5) errors.phone = "Enter your mobile number";
      else if (!isValidPhoneNumber(v.phone)) {
        errors.phone = "Enter a valid phone number for the selected country";
      }
    } else if (!v.email.trim()) {
      errors.email = "Enter your email address";
    } else if (!z.string().email().safeParse(v.email.trim()).success || v.email.length > 100) {
      errors.email = "Enter a valid email address";
    }
    if (v.confirmPassword !== v.password) errors.confirmPassword = "Passwords do not match";
    return errors;
  },
  basic: (v) => {
    const errors: Errors = {};
    if (v.fullName.trim().split(/\s+/).length < 2) {
      errors.fullName = "Enter your first and last name";
    }
    const dob = parseISO(v.dob);
    if (v.dob) {
      if (!isValid(dob) || dob.getFullYear() < 1900) errors.dob = "Enter a valid date";
      else if (isAfter(dob, new Date())) errors.dob = "Date of birth can't be in the future";
      else if (differenceInYears(new Date(), dob) < 18) {
        errors.dob = "You must be at least 18 years old";
      }
    }
    return errors;
  },
  document: (v) => {
    const errors: Errors = {};
    if (v.docType && v.docNumber.trim() && !DOC_FORMATS[v.docType].test(v.docNumber.trim())) {
      errors.docNumber = DOC_NUMBER_ERROR[v.docType];
    }
    if (v.docExpiry) {
      const expiry = parseISO(v.docExpiry);
      if (!isValid(expiry)) errors.docExpiry = "Enter a valid date";
      else if (isBefore(expiry, startOfDay(new Date()))) errors.docExpiry = "This document has expired";
    }
    return errors;
  },
  address: (v) => {
    const errors: Errors = {};
    if (v.proofIssueDate) {
      const issued = parseISO(v.proofIssueDate);
      if (!isValid(issued)) errors.proofIssueDate = "Enter a valid date";
      else if (isAfter(issued, new Date())) errors.proofIssueDate = "The issue date can't be in the future";
      else if (isBefore(issued, subMonths(startOfDay(new Date()), 3))) {
        errors.proofIssueDate = "The document must be issued within the last 3 months";
      }
    }
    return errors;
  },
};

export function createResolver(key: ValidationKey): Resolver<FormValues> {
  return async (values) => {
    const found: Record<string, string> = {};

    const schema = SCHEMAS[key];
    if (schema) {
      const result = schema.safeParse(values);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const field = String(issue.path[0] ?? "");
          if (field && !found[field]) found[field] = issue.message;
        }
      }
    }

    const extra = CROSS_CHECKS[key]?.(values) ?? {};
    for (const [field, message] of Object.entries(extra)) {
      if (message && !found[field]) found[field] = message;
    }

    if (Object.keys(found).length === 0) return { values, errors: {} };

    const errors: Record<string, unknown> = {};
    for (const [field, message] of Object.entries(found)) {
      errors[field] = { type: "validation", message };
    }
    return { values: {}, errors: errors as FieldErrors<FormValues> };
  };
}