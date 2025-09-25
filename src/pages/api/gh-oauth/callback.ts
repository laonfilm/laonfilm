import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  const clientId = locals.runtime.env.GITHUB_CLIENT_ID;
  const clientSecret = locals.runtime.env.GITHUB_CLIENT_SECRET;

  // Debug logs (these show up in Cloudflare Pages logs)
  console.log("DEBUG: clientId =", clientId);
  console.log("DEBUG: clientSecret present?", !!clientSecret);

  if (!clientId || !clientSecret) {
    return new Response(
      "Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in Cloudflare env.",
      { status: 500 }
    );
  }

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

  if (!data.access_token) {
    // Debug-friendly output to show GitHub’s response
    const details = JSON.stringify(data, null, 2);
    const html = `<!doctype html><meta charset="utf-8">
      <h1>OAuth failed</h1>
      <p>GitHub did not return an access token.</p>
      <pre style="white-space:pre-wrap;word-break:break-word;border:1px solid #ccc;padding:12px;">${details}</pre>`;
    return new Response(html, {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const token = data.access_token as string;

  const html = `<!doctype html><meta charset="utf-8">
<script>
  (function () {
    var msg = "authorization:github:success:" + JSON.stringify({
      token: "${token}",
      provider: "github"
    });
    console.log("DEBUG OAUTH MESSAGE:", msg);
    if (window.opener) {
      window.opener.postMessage(msg, "*");
      window.close();
    } else {
      document.body.innerText = "Authentication succeeded. You can close this window.";
    }
  })();
</script>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
