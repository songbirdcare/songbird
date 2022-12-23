import { ManagementClient } from "auth0";
import { z } from "zod";

import { Auth0TokenService } from "./auth0-token-service";

export class Auth0Service {
  #tokenService: Auth0TokenService;
  #sdkClient: ManagementClient | undefined;

  constructor(
    baseUrl: string,
    secret: string,
    clientId: string,
    private readonly domain: string
  ) {
    this.#tokenService = new Auth0TokenService(baseUrl, secret, clientId);
  }

  async getUser(id: string) {
    const client = await this.#client();
    const user = await client.getUser({
      id,
    });

    return fromAuth0(Auth0Profile.parse(user));
  }

  async #client(): Promise<ManagementClient> {
    // TODO ... do we have to refetch periodically?
    if (this.#sdkClient) {
      return this.#sdkClient;
    }

    const token = await this.#tokenService.token();

    this.#sdkClient = new ManagementClient({
      token,
      domain: this.domain,
    });

    return this.#sdkClient;
  }
}

function fromAuth0({
  user_id,
  email,
  email_verified,
  given_name,
  family_name,
  name,
}: Auth0Profile) {
  return {
    sub: user_id,
    email,
    emailVerified: email_verified,
    givenName: given_name,
    familyName: family_name,
    name,
  };
}

const Auth0Profile = z.object({
  user_id: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  given_name: z.optional(z.string()),
  family_name: z.optional(z.string()),
  name: z.optional(z.string()),
});

export type Auth0Profile = z.infer<typeof Auth0Profile>;
