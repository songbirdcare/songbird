import { z } from "zod";

export const ZDocusignSigners = z.array(
  z.object({
    email: z.string(),
    roleName: z.string().optional(),
  })
);

export type DocusignSigners = z.infer<typeof ZDocusignSigners>;

// it does not seem like Docusign returns a good counterparty field
// here we do our best to guess a counterparty email
export function tryGetCounterpartyEmail(
  signers: DocusignSigners
): string | undefined {
  const nonSongbirdEmail = signers
    .map((row) => row.email)
    .find((row) => !row.endsWith("@songbirdcare.com"));

  if (nonSongbirdEmail) {
    return nonSongbirdEmail;
  }

  const nonTeamMember = signers.find((row) => {
    return (
      row.roleName === undefined || !row.roleName.startsWith("Family Team")
    );
  })?.email;

  if (nonTeamMember) {
    return nonTeamMember;
  }

  const lastSigner = signers.at(-1);
  return lastSigner?.email;
}
