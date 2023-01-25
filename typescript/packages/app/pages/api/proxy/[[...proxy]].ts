import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

const endpoint = process.env["PUBLIC_API_ENDPOINT"] as string;

export default withApiAuthRequired(async function proxy(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken } = await getAccessToken(req, res);
  const impersonateHeader = req.cookies["X-Impersonate"];

  const proxy = (() => {
    const path = req.query.proxy ?? [];
    const asArray = Array.isArray(path) ? path : [path];
    return asArray.join("/");
  })();

  const response = await fetch(`${endpoint}/api/v1/${proxy}`, {
    method: req.method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(impersonateHeader && { "X-Impersonate": impersonateHeader }),
    },
    ...(req.body ? { body: JSON.stringify(req.body) } : {}),
  });

  res.status(response.status).json(await response.json());
});
