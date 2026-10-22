/**
 * Masks a mobile number to the specified format:
 * - "agent": "+91 98XXX 4120" (first 2 digits, XXX, last 4 digits)
 * - "list" | "stars": "+91 98*** 4321" (first 2 digits, ***, last 4 digits)
 * - "profile" | "x": "+91 98XXX XX321" (first 2 digits, XXX XX, last 3 digits)
 */
export function maskMobile(
  mobile: string,
  format: "agent" | "list" | "profile" | "stars" | "x" = "stars"
): string {
  if (!mobile) return "";
  const cleaned = mobile.replace(/\D/g, "");
  if (cleaned.length >= 10) {
    const last10 = cleaned.slice(-10);
    const p1 = last10.slice(0, 2);
    const p4 = last10.slice(-4);
    const p3 = last10.slice(-3);

    if (format === "agent") {
      return `+91 ${p1}XXX ${p4}`;
    }
    if (format === "profile" || format === "x") {
      return `+91 ${p1}XXX XX${p3}`;
    }
    // "list" or "stars"
    return `+91 ${p1}*** ${p4}`;
  }
  return mobile;
}

/**
 * Masks a document number showing only the last 4 digits: ••••1234
 */
export function maskDocNumber(docNum: string): string {
  if (!docNum) return "";
  const cleaned = docNum.trim();
  if (cleaned.length <= 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `••••${last4}`;
}

/**
 * Masks an email to the format: "r***@thandal.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email || "";
  const [local, domain] = email.split("@");
  if (!local) return `@${domain}`;
  const firstChar = local.charAt(0);
  return `${firstChar}***@${domain}`;
}
