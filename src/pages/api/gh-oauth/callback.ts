import type { APIRoute } from "astro";

export const get: APIRoute = async ({ request }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing ?code", { status: 400 });

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.protocol}//${url.host}/api/gh-oauth/callback`,
    }),
  });
  const data = await tokenRes.json();
  if (!data.access_token) return new Response("OAuth failed", { status: 400 });

  const token = data.access_token as string;

  const html = `<!doctype html><meta charset="utf-8">
<script>
  (function () {
    var msg = "authorization:github:success:" + JSON.stringify({ token: "${token}" });
    if (window.opener) window.opener.postMessage(msg, "*");
    window.close();
  })();
</script>`;

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
