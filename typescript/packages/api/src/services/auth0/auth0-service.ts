import type { EmailVerification } from "@songbird/precedent-iso";
import { ManagementClient } from "auth0";
import crypto from "crypto";
import { z } from "zod";

import { Auth0TokenService } from "./auth0-token-service";

const CONNECTION = "Username-Password-Authentication";

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

  async createUser(email: string): Promise<"already_exists" | "created"> {
    const client = await this.#client();
    const users = await client.getUsersByEmail(email);

    if (users.length > 0) {
      return "already_exists";
    }

    await client.createUser({
      connection: CONNECTION,
      email,
      password: `${crypto.randomBytes(20).toString("hex")}XYZxyz123!@#`,
    });
    return "created";
  }

  async sendEmailVerification(id: string): Promise<EmailVerification> {
    const client = await this.#client();
    const user = await client.getUser({
      id,
    });

    if (user.email_verified) {
      return "already_verified";
    }

    await client.sendEmailVerification({
      user_id: id,
    });
    return "sent";
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
