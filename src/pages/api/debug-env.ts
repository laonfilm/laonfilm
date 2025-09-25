import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime?.env || {};

  return new Response(
    JSON.stringify(
      {
        availableKeys: Object.keys(env),        // list of all env var names
        clientId: env.GITHUB_CLIENT_ID || null, // should show your Client ID
        hasSecret: !!env.GITHUB_CLIENT_SECRET,  // true if secret is present
        scope: env.GITHUB_OAUTH_SCOPE || null,  // optional
      },
      null,
      2
    ),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
