import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

const endpoint = process.env["PUBLIC_API_ENDPOINT"] as string;

export default withApiAuthRequired(async function products(req, res) {
  const { accessToken } = await getAccessToken(req, res, {});
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  res.status(200).json(json);
});
