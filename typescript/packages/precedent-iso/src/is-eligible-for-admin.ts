const SUFFIX = "songbirdcare.com";

export interface Arguments {
  email: string;
  emailVerified: boolean;
}
export function isEligibleForAdmin({
  email,
  emailVerified,
}: Arguments): boolean {
  if (!emailVerified) {
    return false;
  }
  const address = email.split("@").pop();
  if (!address) {
    throw new Error("invalid address");
  }

  return address.toLowerCase() === SUFFIX;
}
