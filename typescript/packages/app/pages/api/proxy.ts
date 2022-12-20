import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

const endpoint = process.env["PUBLIC_API_ENDPOINT"] as string;

export default withApiAuthRequired(async function products(req, res) {
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid", "profile", "email"],
  });
  console.log(accessToken);

  const response = await fetch(`${endpoint}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const t = await response.text();

  //const json = await response.json();
  res.status(200).json(t);
});
