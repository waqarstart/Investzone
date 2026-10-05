const REGION_CODES = [
  "PK", "AE", "SA", "QA", "KW", "BH", "OM", "US", "GB", "CA", "AU", "DE", "FR", "IT",
  "ES", "NL", "SE", "NO", "DK", "CH", "TR", "EG", "JO", "LB", "IQ", "IR", "AF", "BD",
  "IN", "LK", "NP", "MY", "SG", "ID", "TH", "PH", "CN", "JP", "KR", "HK", "NZ", "ZA",
  "NG", "KE", "GH", "MA", "BR", "MX", "AR", "IE", "BE", "AT", "PT", "PL", "RU", "UA",
];

export interface CountryOption {
  code: string;
  name: string;
}

function nameFor(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export const COUNTRIES: CountryOption[] = REGION_CODES.map((code) => ({
  code,
  name: nameFor(code),
})).sort((a, b) => a.name.localeCompare(b.name));