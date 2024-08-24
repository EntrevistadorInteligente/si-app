import { UserManagerSettings } from "oidc-client-ts";

export const settings: UserManagerSettings = {
  authority: process.env.NEXT_PUBLIC_KC_ISSUER!,
  client_id: process.env.NEXT_PUBLIC_KC_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_KC_REDIRECT_URI!,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_KC_LOGOUT_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile",
}