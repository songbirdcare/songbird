export interface Settings {
  host: string;
  port: number;
}

class GetSettings {
  static fromEnv = () => ({
    host: process.env["HOST"] ?? "localhost",
    port: Number(process.env["PORT"] ?? "3000"),
  });
}

export const SETTINGS = GetSettings.fromEnv();
