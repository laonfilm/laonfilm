import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  const clientId = locals.runtime.env.GITHUB_CLIENT_ID;
  const scope = locals.runtime.env.GITHUB_OAUTH_SCOPE || "public_repo";

  // Debug logs (these show up in Cloudflare Pages logs)
  console.log("DEBUG AUTH: clientId =", clientId);
  console.log("DEBUG AUTH: scope =", scope);

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID in Cloudflare env.", { status: 500 });
  }

  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${base}/api/gh-oauth/callback`);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("allow_signup", "true");

  return Response.redirect(authorize.toString(), 302);
};
