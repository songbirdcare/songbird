import { ManagementClient } from "auth0";

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

  async getUser(id: string): Promise<unknown> {
    const client = await this.#client();

    const user = await client.getUser({
      id,
    });

    return {
      id: user.user_id,
      email_verified: user.email_verified,
    };
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
