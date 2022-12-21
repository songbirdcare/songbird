import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

const endpoint = process.env["PUBLIC_API_ENDPOINT"] as string;

export default withApiAuthRequired(async function products(req, res) {
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid", "profile", "email"],
  });

  const proxy = (() => {
    const path = req.query.proxy ?? [];
    const asArray = Array.isArray(path) ? path : [path];
    return asArray.join("/");
  })();

  const response = await fetch(`${endpoint}/api/v1/${proxy}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  res.status(200).json(await response.json());
});
