const endpoint = process.env["PUBLIC_API_ENDPOINT"] as string;

import type { NextApiRequest, NextApiResponse } from "next";

export default async function proxy(req: NextApiRequest, res: NextApiResponse) {
  const proxy = (() => {
    const path = req.query.proxy ?? [];
    const asArray = Array.isArray(path) ? path : [path];
    return asArray.join("/");
  })();

  const response = await fetch(`${endpoint}/api/v1/${proxy}`, {
    method: req.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
    ...(req.body ? { body: JSON.stringify(req.body) } : {}),
  });
  res.status(response.status).json(await response.json());
}
