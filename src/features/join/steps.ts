export interface JoinStep {
  id: string
  label: string
  eyebrow: string
  heading: string
  helper: string
}

export const STEPS: readonly JoinStep[] = [
  {
    id: "name",
    label: "Your name",
    eyebrow: "NAME",
    heading: "What's your name?",
    helper: "Use the name you'd like other members to see.",
  },
  {
    id: "contact",
    label: "Contact details",
    eyebrow: "DIRECT CHANNEL",
    heading: "How can we reach you?",
    helper: "We'll send a 6-digit confirmation code to verify your direct access line.",
  },
  {
    id: "verification",
    label: "Verification",
    eyebrow: "VERIFICATION",
    heading: "Enter your code",
    helper: "We sent a 6-digit code to {contact}.",
  },
  {
    id: "security",
    label: "Security",
    eyebrow: "SECURITY",
    heading: "Quick security check",
    helper: "Confirm you're human to protect Bridgeway members.",
  },
  {
    id: "location",
    label: "Location",
    eyebrow: "LOCATION",
    heading: "Where are you based?",
    helper: "This helps us match you with people near you.",
  },
  {
    id: "role",
    label: "Join as",
    eyebrow: "ROLE",
    heading: "How will you use Bridgeway?",
    helper: "Pick the role that fits you best. You can add more later.",
  },
]

export const STEP_COUNT = STEPS.length
