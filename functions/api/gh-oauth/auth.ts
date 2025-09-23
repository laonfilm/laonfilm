export const onRequestGet: PagesFunction = async (ctx) => {
  const { GITHUB_CLIENT_ID, GITHUB_OAUTH_SCOPE } = ctx.env as any;
  const scope = GITHUB_OAUTH_SCOPE || "public_repo"; // use "repo" if your repo is private

  const url = new URL(ctx.request.url);
  const base = `${url.protocol}//${url.host}`;

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", GITHUB_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", `${base}/api/gh-oauth/callback`);
  authorize.searchParams.set("scope", scope);

  return Response.redirect(authorize.toString(), 302);
};
