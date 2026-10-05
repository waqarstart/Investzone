import { parsePhoneNumberFromString } from "libphonenumber-js"

export function formatInternational(phone: string): string {
  const parsed = parsePhoneNumberFromString(phone)
  return parsed ? parsed.formatInternational() : phone
}

export function maskPhone(phone: string): string {
  const parsed = parsePhoneNumberFromString(phone)
  if (!parsed) return phone

  const national = parsed.nationalNumber
  const dialCode = `+${parsed.countryCallingCode}`

  if (national.length <= 6) return `${dialCode} ${national}`

  return `${dialCode} ${national.slice(0, 3)} •••• ${national.slice(-3)}`
}

export function maskEmail(email: string): string {
  const trimmed = email.trim()
  const atIndex = trimmed.indexOf("@")
  if (atIndex <= 0) return trimmed

  const local = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex)
  return `${local.slice(0, 1)}•••${domain}`
}
