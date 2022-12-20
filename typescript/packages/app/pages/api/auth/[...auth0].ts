import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default handleAuth({
  async signup(req: NextApiRequest, res: NextApiResponse) {
    const email = getEmail(req.query);
    handleLogin(req, res, {
      authorizationParams: {
        screen_hint: "signup",
        login_hint: email,
      },
    });
  },
});

function getEmail(query: NextApiRequest["query"]): string {
  const email = query.email;
  if (Array.isArray(email)) {
    return email[0] ?? "";
  } else if (!email) {
    return "";
  }
  return email;
}
