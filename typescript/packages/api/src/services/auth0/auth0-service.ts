import type { EmailVerification } from "@songbird/precedent-iso";
import { ManagementClient } from "auth0";
import { z } from "zod";

import { LOGGER } from "../../logger";
import { Auth0TokenService } from "./auth0-token-service";

const CONNECTION = "Username-Password-Authentication";

export class Auth0Service {
  #tokenService: Auth0TokenService;
  #managementClient: ManagementClient | undefined;

  constructor(
    baseUrl: string,
    secret: string,
    clientId: string,
    audience: string,
    private readonly domain: string
  ) {
    this.#tokenService = new Auth0TokenService(
      baseUrl,
      secret,
      clientId,
      audience
    );
  }

  async createUser({
    email,
    password,
  }: CreateUserArgs): Promise<CreateUserResponse> {
    const client = await this.#client();
    const users = await client.getUsersByEmail(email);

    // do we have to check for multiple connections here?
    if (users.length > 0) {
      LOGGER.info(`Not creating email=${email} as they already exist`);
      const id = users[0]?.user_id;
      if (id === undefined) {
        throw new Error("User ID is undefined");
      }
      return {
        status: "already_exists",
        user: {
          email,
          sub: id,
          connectionType: this.#getConnectionType(id),
        },
      };
    }

    const user = await client.createUser({
      connection: CONNECTION,
      email,
      password,
    });

    const sub = user.user_id;
    if (sub === undefined) {
      throw new Error("id is undefined");
    }

    return {
      status: "created",
      user: {
        email,
        sub,
        connectionType: this.#getConnectionType(sub),
      },
    };
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
    return fromAuth0(ZAuth0Profile.parse(user));
  }

  #getConnectionType(id: string): "google-oauth2" | "auth0" {
    const [type] = id.split("|", 1);
    return ZConnectionType.parse(type);
  }

  async #client(): Promise<ManagementClient> {
    // TODO ... do we have to refetch periodically?
    if (this.#managementClient) {
      return this.#managementClient;
    }

    const token = await this.#tokenService.token();
    this.#managementClient = new ManagementClient({
      token,
      domain: this.domain,
    });

    return this.#managementClient;
  }
}

interface CreateUserArgs {
  email: string;
  password: string;
}

interface UserObject {
  sub: string;
  email: string;
  connectionType: ConnectionType;
}

interface CreateUserResponse {
  user: UserObject;
  status: "already_exists" | "created";
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

const ZConnectionType = z.union([
  z.literal("auth0"),
  z.literal("google-oauth2"),
]);

type ConnectionType = z.infer<typeof ZConnectionType>;

const ZAuth0Profile = z.object({
  user_id: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  name: z.string().optional(),
});

export type Auth0Profile = z.infer<typeof ZAuth0Profile>;
