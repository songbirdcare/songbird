import axios from "axios";

export class Auth0TokenService {
  #token: string | undefined;

  constructor(
    private readonly baseUrl: string,
    private readonly secret: string,
    private readonly clientId: string
  ) {}

  async token(): Promise<string> {
    if (this.#token === undefined) {
      this.#token = (
        await axios.post<{ access_token: string }>(
          `${this.baseUrl}/oauth/token`,
          {
            client_id: this.clientId,
            client_secret: this.secret,
            audience: `${this.baseUrl}/api/v2/`,
            grant_type: "client_credentials",
          }
        )
      ).data.access_token;
    }

    return this.#token;
  }
}
