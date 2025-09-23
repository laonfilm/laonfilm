import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const scope = import.meta.env.GITHUB_OAUTH_SCOPE || "public_repo";

  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${base}/api/gh-oauth/callback`);
  authorize.searchParams.set("scope", scope);

  return Response.redirect(authorize.toString(), 302);
};
